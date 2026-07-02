import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyUrls } from "../api/shortUrl";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

const MyUrlsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const { data: urls = [], isLoading, isError, error } = useQuery({
    queryKey: ["my-urls"],
    queryFn: getMyUrls,
    enabled: !!user,
  });

  if (!authLoading && !user) {
    navigate({ to: "/login" });
    return null;
  }

  const handleCopy = async (id, shortUrl) => {
    const backendBaseUrl = window.location.origin.includes("localhost")
      ? "http://localhost:3000"
      : "https://url-shortener-2ufk.onrender.com";
    const fullShortUrl = backendBaseUrl + "/" + shortUrl;
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const totalClicks = urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and manage your shortened links.
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="self-start sm:self-auto rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
          >
            Create New Link
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl p-6 premium-card relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-slate-700 transition-all group-hover:w-2"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Links Created
            </p>
            <p className="mt-2.5 text-3.5xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "..." : urls.length}
            </p>
          </div>
          <div className="rounded-2xl p-6 premium-card relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-slate-500 transition-all group-hover:w-2"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Clicks
            </p>
            <p className="mt-2.5 text-3.5xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "..." : totalClicks}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden premium-card">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="flex h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></span>
            </div>
          ) : isError ? (
            <div className="flex h-40 items-center justify-center text-sm text-red-500 font-semibold bg-red-50/50">
              {error.message || "Failed to load short URLs."}
            </div>
          ) : urls.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center p-6 bg-white/50">
              <p className="text-sm font-medium text-slate-500">No shortened links yet.</p>
              <button
                onClick={() => navigate({ to: "/" })}
                className="mt-2 text-xs font-semibold text-slate-900 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Create your first link &rarr;
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-white">
                    <th className="py-4 px-6 font-semibold">Original URL</th>
                    <th className="py-4 px-6 font-semibold">Short URL</th>
                    <th className="py-4 px-6 text-center font-semibold">Clicks</th>
                    <th className="py-4 px-6 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white/40">
                  {urls.map((url) => {
                    const fullShortUrl =
                      (window.location.origin.includes("localhost")
                        ? "http://localhost:3000"
                        : "https://url-shortener-2ufk.onrender.com") +
                      "/" +
                      url.short_url;
                    return (
                      <tr key={url._id} className="hover:bg-white/70 transition-colors">
                        <td className="py-4 px-6 max-w-xs truncate text-slate-500">
                          <a
                            href={url.full_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-slate-900 hover:underline transition-colors"
                            title={url.full_url}
                          >
                            {url.full_url}
                          </a>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">
                          <a
                            href={fullShortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-slate-700 hover:underline transition-colors"
                          >
                            {url.short_url}
                          </a>
                        </td>
                        <td className="py-4 px-6 text-center text-slate-700 font-semibold">
                          {url.clicks || 0}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleCopy(url._id, url.short_url)}
                            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 border cursor-pointer active:scale-95 ${
                              copiedId === url._id
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                            }`}
                          >
                            {copiedId === url._id ? "Copied!" : "Copy"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyUrlsPage;
