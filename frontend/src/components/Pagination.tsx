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

  // Generate page numbers dynamically
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="py-4 px-2 flex items-center justify-between text-[var(--text-muted)] border-t border-[var(--border-light)] mt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="py-2 px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-light)] hover:border-fcGarnet/30 transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
              currentPage === pageNum
                ? "bg-gradient-to-r from-fcGarnet to-fcBlue text-white shadow-glow-garnet"
                : "bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-fcGarnet/30"
            }`}
          >
            {pageNum}
          </button>
        ))}
        {totalPages > 5 && (
          <>
            <span className="px-2 text-[var(--text-dim)]">...</span>
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`w-9 h-9 rounded-lg text-sm flex items-center justify-center transition-all ${
                currentPage === totalPages
                  ? "bg-gradient-to-r from-fcGarnet to-fcBlue text-white shadow-glow-garnet"
                  : "bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-fcGarnet/30"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="py-2 px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-light)] hover:border-fcGarnet/30 transition-all duration-200 flex items-center gap-2"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;