const Pagination = () => {
  return (
    <div className="py-4 px-2 flex items-center justify-between text-[var(--text-muted)] border-t border-[var(--border-light)] mt-4">
      <button
        disabled
        className="py-2 px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-light)] hover:border-fcGarnet/30 transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-1">
        <button className="w-9 h-9 rounded-lg bg-gradient-to-r from-fcGarnet to-fcBlue text-white text-sm font-semibold shadow-glow-garnet flex items-center justify-center">
          1
        </button>
        <button className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm hover:border-fcGarnet/30 transition-all flex items-center justify-center">
          2
        </button>
        <button className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm hover:border-fcGarnet/30 transition-all flex items-center justify-center">
          3
        </button>
        <span className="px-2 text-[var(--text-dim)]">...</span>
        <button className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm hover:border-fcGarnet/30 transition-all flex items-center justify-center">
          10
        </button>
      </div>

      <button className="py-2 px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium hover:bg-[var(--bg-surface-light)] hover:border-fcGarnet/30 transition-all duration-200 flex items-center gap-2">
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
