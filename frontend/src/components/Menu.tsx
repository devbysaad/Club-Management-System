"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        icon: "/home.png",
        label: "Dashboard",
        href: "/admin",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Coaches",
        href: "/list/teachers",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
      {
        icon: "/student.png",
        label: "Players",
        href: "/list/students",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "staff", "teacher"],
      },
      {
        icon: "/setting.png",
        label: "Staff",
        href: "/list/staff",
        visible: ["admin", "staff"],
      },
      {
        icon: "/class.png",
        label: "Teams",
        href: "/list/classes",
        visible: ["admin", "staff", "teacher"],
      },
    ],
  },
  // {
  //   title: "FOOTBALL",
  //   items: [
  //     {
  //       icon: "/subject.png",
  //       label: "Training",
  //       href: "/list/subjects",
  //       visible: ["admin"],
  //     },
  //     {
  //       icon: "/lesson.png",
  //       label: "Sessions",
  //       href: "/list/lessons",
  //       visible: ["admin", "teacher"],
  //     },
  //     {
  //       icon: "/exam.png",
  //       label: "Fixtures",
  //       href: "/list/exams",
  //       visible: ["admin", "teacher", "student", "parent"],
  //     },
  //     {
  //       icon: "/assignment.png",
  //       label: "Stats",
  //       href: "/list/assignments",
  //       visible: ["admin", "teacher", "student", "parent"],
  //     },
  //     {
  //       icon: "/result.png",
  //       label: "Results",
  //       href: "/list/results",
  //       visible: ["admin", "teacher", "student", "parent"],
  //     },
  //   ],
  // },
  {
    title: "CLUB",
    items: [
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "News",
        href: "/list/announcements",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Shop",
        href: "/shop",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Orders",
        href: "/admin/orders",
        visible: ["admin", "staff"],
      },
      {
        icon: "/announcement.png",
        label: "Admissions",
        href: "/admin/admission",
        visible: ["admin", "staff"],
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "About",
        href: "/about",
        visible: ["admin", "staff", "teacher", "student", "parent"],
      },
    ],
  },
];



const Menu = () => {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  // Debug logging
  console.log("🔍 MENU DEBUG:", {
    isLoaded,
    hasUser: !!user,
    role,
    publicMetadata: user?.publicMetadata
  });

  // Show loading skeleton while auth is loading
  if (!isLoaded) {
    return (
      <div className="py-2 px-2 lg:px-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4">
            <div className="h-3 bg-[var(--bg-surface)] rounded w-16 mb-3 mx-2" />
            <div className="space-y-2">
              <div className="h-10 bg-[var(--bg-surface)] rounded-xl" />
              <div className="h-10 bg-[var(--bg-surface)] rounded-xl" />
              <div className="h-10 bg-[var(--bg-surface)] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If no role is set, show error message
  if (!role) {
    return (
      <div className="py-4 px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm font-medium mb-2">⚠️ No Role Assigned</p>
          <p className="text-xs text-[var(--text-muted)]">
            Please set your role in Clerk Dashboard → Users → Public Metadata → Add "role":"admin"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 px-2 lg:px-3">
      {menuItems.map((section) => (
        <div className="flex flex-col mb-1" key={section.title}>
          {/* Section Title - Desktop only */}
          <span className="hidden lg:block text-[var(--text-dim)] font-heading font-semibold text-[10px] uppercase tracking-[0.15em] my-3 px-2">
            {section.title}
          </span>

          {/* Divider for mobile */}
          <div className="lg:hidden my-2 mx-auto w-8 h-[1px] bg-[var(--border-color)]" />

          {/* Menu Items */}
          <div className="flex flex-col gap-1">
            {section.items.map((item) => {
              // Convert role to lowercase for case-insensitive comparison
              const normalizedRole = role?.toLowerCase();

              if (normalizedRole && item.visible.includes(normalizedRole)) {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`
                      flex items-center justify-center lg:justify-start gap-3 
                      py-2.5 px-2 lg:px-3 rounded-xl transition-all duration-200 group relative
                      ${isActive
                        ? "bg-rmBlue/10 text-[var(--text-primary)] border-l-3 border-rmBlue"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-light)] hover:text-[var(--text-primary)]"
                      }
                    `}
                    title={item.label}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rmBlue rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={18}
                        height={18}
                        className={`
                          transition-all duration-200 
                          ${isActive ? "opacity-100" : "opacity-50 group-hover:opacity-80"}
                        `}
                        style={{
                          filter: isActive
                            ? "brightness(0) invert(1)"
                            : "brightness(0) invert(0.5)"
                        }}
                      />
                    </div>

                    {/* Label - Desktop only */}
                    <span className={`
                      hidden lg:block text-[13px] font-medium truncate
                      ${isActive ? "font-semibold" : ""}
                    `}>
                      {item.label}
                    </span>

                    {/* Hover Arrow - Desktop only */}
                    <svg
                      className={`
                        hidden lg:block w-4 h-4 ml-auto flex-shrink-0 transition-all duration-200
                        ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"}
                      `}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
