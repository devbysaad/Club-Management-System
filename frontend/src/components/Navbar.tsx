"use client";

import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

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

        {/* Messages */}
        <button className="relative p-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] border border-[var(--border-color)] hover:border-fcBlue/50 transition-all duration-300 group">
          <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-fcBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] border border-[var(--border-color)] hover:border-fcGarnet/50 transition-all duration-300 group">
          <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-fcGarnet transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white rounded-full text-[10px] font-bold shadow-glow-garnet">
            3
          </div>
        </button>

        {/* Divider */}
        <div className="w-[1px] h-8 bg-[var(--border-color)] mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-surface)] transition-all duration-300 cursor-pointer group">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-fcGold transition-colors">
              Carlos Rodríguez
            </span>
            <span className="text-[11px] text-[var(--text-muted)] flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 bg-fcGold rounded-full" />
              Club Director
            </span>
          </div>

          {/* Avatar with Status Ring */}
          <div className="relative">
            <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-fcGarnet to-fcBlue opacity-50" />
            <Image
              src="/avatar.png"
              alt=""
              width={42}
              height={42}
              className="rounded-full ring-2 ring-[var(--bg-sidebar)] relative z-10"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-fcGreen rounded-full border-2 border-[var(--bg-sidebar)] z-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;