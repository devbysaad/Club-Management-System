"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between py-3 px-2 md:px-4 border-t border-fcBorder mt-4 text-[var(--text-muted)]">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="min-h-[44px] md:min-h-0 py-2.5 md:py-2 px-3 md:px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-light)] active:scale-95 transition-all touch-manipulation"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Page Numbers - Hidden on very small screens */}
      <div className="hidden xs:flex items-center gap-1.5 md:gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`min-w-[44px] md:min-w-0 w-10 md:w-9 h-10 md:h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all touch-manipulation ${currentPage === p
                ? "bg-gradient-to-r from-fcGarnet to-fcBlue text-white shadow-glow-garnet scale-105"
                : "bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-fcGarnet/30 active:scale-95"
              }`}
          >
            {p}
          </button>
        ))}
        {totalPages > 5 && (
          <>
            <span className="px-1 md:px-2 text-[var(--text-dim)]">...</span>
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`min-w-[44px] md:min-w-0 w-10 md:w-9 h-10 md:h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all touch-manipulation ${currentPage === totalPages
                  ? "bg-gradient-to-r from-fcGarnet to-fcBlue text-white shadow-glow-garnet scale-105"
                  : "bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-fcGarnet/30 active:scale-95"
                }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Mobile: Current page indicator */}
      <div className="xs:hidden text-sm font-medium">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="min-h-[44px] md:min-h-0 py-2.5 md:py-2 px-3 md:px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-light)] active:scale-95 transition-all touch-manipulation"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>
    </div>
  );
};

export default Pagination;
