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
    <form className="w-full space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="long-url" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
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
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none premium-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
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
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none premium-input"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Shortening..." : "Shorten URL"}
      </button>

      <div aria-live="polite">
        {isPending && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="flex h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-transparent"></span>
            <span>Generating your secure link...</span>
          </div>
        )}
        {isSuccess && (
          <p className="mt-4 text-center text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 py-2 rounded-lg">
            Short URL created successfully!
          </p>
        )}
        {error && (
          <p id="url-error" className="mt-4 text-center text-xs text-red-600 font-semibold bg-red-50 border border-red-100 py-2 rounded-lg" role="alert">
            {error.message || "Something went wrong."}
          </p>
        )}
      </div>
    </form>
  );
};

export default UrlForm;
