'use client';

import { useTheme } from "@/lib/ThemeContext";
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  const roleLabels: Record<string, string> = {
    admin: "Club Director",
    teacher: "Coach",
    student: "Player",
    parent: "Parent",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[var(--bg-sidebar)] border-b border-[var(--border-color)] sticky top-0 z-40 backdrop-blur-sm">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-3 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-2.5 focus-within:border-fcGarnet/50 focus-within:shadow-glow-garnet transition-all duration-300 w-[320px]">
        <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search players, coaches, matches..."
          className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-dim)] text-sm"
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-[var(--text-dim)] bg-[var(--bg-surface-light)] rounded border border-[var(--border-color)]">
          ⌘ K
        </kbd>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 justify-end w-full md:w-auto">
        {/* Quick Stats */}
        <div className="hidden xl:flex items-center gap-3 mr-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fcGreen/10 border border-fcGreen/20">
            <div className="w-2 h-2 bg-fcGreen rounded-full animate-pulse" />
            <span className="text-xs text-fcGreen font-medium">Next Match: 3 days</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative p-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] border border-[var(--border-color)] transition-all duration-300 group"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-fcGold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-fcBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Messages & Notifications */}
        {/* ... keep your existing buttons ... */}

        {/* Divider */}
        <div className="w-[1px] h-8 bg-[var(--border-color)] mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-surface)] transition-all duration-300 cursor-pointer group">
          {/* Name + Role */}
          <div className="flex flex-col text-right pr-2">
            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-fcGold transition-colors">
              {/* User name comes from Clerk automatically in UserButton */}
              <UserButton
                showName={true}
                appearance={{
                  elements: {
                    userButtonText: "text-sm font-semibold text-[var(--text-primary)] group-hover:text-fcGold",
                  },
                }}
              />
            </span>
            <span className="text-[11px] text-[var(--text-muted)] flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 bg-fcGold rounded-full" />
              {isLoaded && role ? roleLabels[role] : "Loading..."}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
