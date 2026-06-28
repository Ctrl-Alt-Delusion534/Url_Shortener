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
    <div className="min-h-[calc(100vh-4rem)] bg-[#f3f4f6] px-4 py-16 text-slate-900 flex items-center justify-center font-sans">
      <div className="w-full max-w-[480px] rounded-lg border border-[#e2e8f0] bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb] text-white font-bold shadow-sm">
            <span>⚡</span>
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Shorten your link
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Create clean, fast-redirecting short links in seconds.
          </p>
        </div>

        {authLoading ? (
          <div className="flex h-40 items-center justify-center mt-8">
            <span className="flex h-6 w-6 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent"></span>
          </div>
        ) : !user ? (
          <div className="mt-8 text-center p-6 border border-slate-200 rounded-lg bg-slate-50/50">
            <p className="text-sm text-slate-500">
              You must be signed in to shorten URLs.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => navigate({ to: "/login" })}
                className="w-full rounded-lg bg-[#2563eb] py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate({ to: "/register" })}
                className="w-full rounded-lg bg-slate-50 border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
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
              <div className="mt-6 rounded-lg border border-[#e2e8f0] bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Short Link Generated
                </p>
                <a
                  href={mutation.data}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
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
