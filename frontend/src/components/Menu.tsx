"use client";

import { role } from "@/lib/data";
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
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Coaches",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Players",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/class.png",
        label: "Teams",
        href: "/list/classes",
        visible: ["admin", "teacher"],
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
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "News",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
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
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];


const Menu = () => {
  const pathname = usePathname();

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
              if (item.visible.includes(role)) {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`
                      flex items-center justify-center lg:justify-start gap-3 
                      py-2.5 px-2 lg:px-3 rounded-xl transition-all duration-200 group relative
                      ${isActive
                        ? "bg-gradient-to-r from-fcGarnet/20 to-fcBlue/10 text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                      }
                    `}
                    title={item.label}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-fcGarnet to-fcBlue rounded-r-full" />
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
