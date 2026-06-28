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
      : window.location.origin;
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#f3f4f6] px-4 py-12 text-slate-900 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e2e8f0] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track analytics of your shortened links.
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition duration-200 cursor-pointer"
          >
            Create New Link
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Links Created
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {isLoading ? "..." : urls.length}
            </p>
          </div>
          <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Clicks
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {isLoading ? "..." : totalClicks}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-[#e2e8f0] bg-white overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="flex h-6 w-6 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent"></span>
            </div>
          ) : isError ? (
            <div className="flex h-40 items-center justify-center text-sm text-red-500 font-semibold">
              {error.message || "Failed to load short URLs."}
            </div>
          ) : urls.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center p-6">
              <p className="text-sm text-slate-500">No shortened links yet.</p>
              <button
                onClick={() => navigate({ to: "/" })}
                className="mt-2 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer"
              >
                Create your first link &rarr;
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">Original URL</th>
                    <th className="py-3 px-6">Short URL</th>
                    <th className="py-3 px-6">Slug</th>
                    <th className="py-3 px-6 text-center">Clicks</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-sm text-slate-700">
                  {urls.map((url) => {
                    const fullShortUrl = (window.location.origin.includes("localhost") ? "http://localhost:3000" : window.location.origin) + "/" + url.short_url;
                    return (
                      <tr key={url._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 max-w-xs truncate text-slate-600">
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
                        <td className="py-3.5 px-6 font-semibold text-[#2563eb]">
                          <a
                            href={fullShortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#1d4ed8] hover:underline transition-colors"
                          >
                            {url.short_url}
                          </a>
                        </td>
                        <td className="py-3.5 px-6 text-slate-400 font-mono">
                          {url.slug || "-"}
                        </td>
                        <td className="py-3.5 px-6 text-center text-slate-900 font-bold">
                          {url.clicks || 0}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => handleCopy(url._id, url.short_url)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition duration-200 border cursor-pointer ${
                              copiedId === url._id
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
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
