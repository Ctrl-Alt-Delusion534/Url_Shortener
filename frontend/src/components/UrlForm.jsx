const UrlForm = ({
  longUrl,
  onUrlChange,
  slug,
  onSlugChange,
  handleSubmit,
  isPending,
  isSuccess,
  error,
}) => {
  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="long-url" className="text-xs font-bold text-slate-700">
          Destination URL
        </label>
        <input
          id="long-url"
          name="url"
          value={longUrl}
          onChange={onUrlChange}
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com/your-long-link"
          disabled={isPending}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "url-error" : undefined}
          className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-xs font-bold text-slate-700">
          Custom Alias / Slug (Optional)
        </label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={onSlugChange}
          type="text"
          placeholder="e.g. my-slug"
          disabled={isPending}
          className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1d4ed8] transition disabled:opacity-50 disabled:cursor-not-allowed duration-200 mt-2 cursor-pointer"
      >
        {isPending ? "Shortening..." : "Shorten URL"}
      </button>

      <div aria-live="polite">
        {isPending && (
          <p className="mt-3 text-xs text-slate-500">Shortening your link...</p>
        )}
        {isSuccess && (
          <p className="mt-3 text-xs text-[#2563eb] font-semibold">
            Short URL created successfully!
          </p>
        )}
        {error && (
          <p id="url-error" className="mt-3 text-xs text-red-500 font-semibold" role="alert">
            {error.message || "Something went wrong."}
          </p>
        )}
      </div>
    </form>
  );
};

export default UrlForm;
