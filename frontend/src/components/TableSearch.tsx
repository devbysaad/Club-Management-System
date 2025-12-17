"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const TableSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const [value, setValue] = useState(currentSearch);

  // keep input in sync when URL changes (back/forward navigation)
  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    const params = new URLSearchParams(searchParams.toString());

    if (newValue.trim()) {
      params.set("search", newValue);
    } else {
      params.delete("search");
    }

    // update URL → triggers server component re-run
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-2.5 focus-within:border-fcGarnet/50 focus-within:shadow-glow-garnet transition-all duration-300">
      <svg
        className="w-4 h-4 text-[var(--text-muted)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={handleChange}
        className="w-[200px] bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-dim)] text-sm"
      />
    </div>
  );
};

export default TableSearch;
