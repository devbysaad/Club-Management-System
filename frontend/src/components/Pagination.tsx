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
    <div className="flex items-center justify-between py-3 px-2 border-t border-fcBorder mt-4 text-[var(--text-muted)]">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="py-2 px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-light)] transition-colors"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
              currentPage === p
                ? "bg-gradient-to-r from-fcGarnet to-fcBlue text-white shadow-glow-garnet"
                : "bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-fcGarnet/30"
            }`}
          >
            {p}
          </button>
        ))}
        {totalPages > 5 && (
          <>
            <span className="px-2 text-[var(--text-dim)]">...</span>
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
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

      {/* Next */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="py-2 px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-surface-light)] transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
