import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortenUrl } from "../api/shortUrl";
import UrlForm from "../components/UrlForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [longUrl, setLongUrl] = useState("");
  const [slug, setSlug] = useState("");

  const mutation = useMutation({
    mutationKey: ["shorten-url"],
    mutationFn: shortenUrl,
    onSuccess: () => {
      setLongUrl("");
      setSlug("");
      queryClient.invalidateQueries({ queryKey: ["my-urls"] });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ url: longUrl, slug: slug.trim() || undefined });
  };

  const handleUrlChange = (event) => {
    setLongUrl(event.target.value);
    if (!mutation.isPending && (mutation.isError || mutation.isSuccess)) {
      mutation.reset();
    }
  };

  const handleSlugChange = (event) => {
    setSlug(event.target.value);
    if (!mutation.isPending && (mutation.isError || mutation.isSuccess)) {
      mutation.reset();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-20 flex items-center justify-center">
      <div className="w-full max-w-[460px] rounded-2xl p-8 sm:p-10 premium-card">
        <div className="text-center">

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 font-sans">
            Shorten your link
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
            Create clean, fast-redirecting custom short links in seconds.
          </p>
        </div>

        {authLoading ? (
          <div className="flex h-40 items-center justify-center mt-8">
            <span className="flex h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></span>
          </div>
        ) : !user ? (
          <div className="mt-8 text-center p-6 border border-slate-200/60 rounded-xl bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">
              You must be signed in to shorten URLs.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => navigate({ to: "/login" })}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-2.5 text-sm font-semibold text-white transition-all duration-205 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate({ to: "/register" })}
                className="w-full rounded-xl bg-white border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all duration-205 cursor-pointer"
              >
                Create an Account
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <UrlForm
                longUrl={longUrl}
                onUrlChange={handleUrlChange}
                slug={slug}
                onSlugChange={handleSlugChange}
                handleSubmit={handleSubmit}
                isPending={mutation.isPending}
                isSuccess={mutation.isSuccess}
                error={mutation.error}
              />
            </div>

            {mutation.isSuccess && (
              <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500"></div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Short Link Generated
                </p>
                <a
                  href={mutation.data}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm font-medium text-slate-900 hover:text-slate-800 hover:underline transition-all"
                >
                  {mutation.data}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
