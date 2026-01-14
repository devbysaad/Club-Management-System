export const dynamic = "force-dynamic";

// INSTRUCTION: Create src/app/(dashboard)/list/parents/[id]/page.tsx

import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const SingleParentPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const parentId = params.id;

  // Fetch parent with their students
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    include: {
      students: {
        include: {
          ageGroup: true,
        },
      },
    },
  });

  if (!parent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-2">
            Parent Not Found
          </h1>
          <p className="text-fcTextMuted">The parent you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="glass-card rounded-2xl py-6 px-6 flex-1 flex gap-6">
            <div className="w-1/3 flex items-center justify-center">
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-fcGold to-fcGarnet flex items-center justify-center border-4 border-fcGold/30">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center border-2 border-fcBorder">
                  <span className="text-white font-bold text-xs">👨‍👩‍👦</span>
                </div>
              </div>
            </div>

            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-white mb-1">
                  {parent.firstName} {parent.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-fcGold/20 text-fcGold text-xs font-medium">
                    Parent/Guardian
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-fcBlue/20 text-fcBlue text-xs font-medium">
                    {parent.students.length} {parent.students.length === 1 ? "Child" : "Children"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fcSurface flex items-center justify-center">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                  </div>
                  <div>
                    <p className="text-fcTextDim">Email</p>
                    <p className="text-white font-medium text-[10px]">
                      {parent.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fcSurface flex items-center justify-center">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                  </div>
                  <div>
                    <p className="text-fcTextDim">Phone</p>
                    <p className="text-white font-medium">{parent.phone || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-fcSurface flex items-center justify-center">
                    <svg className="w-4 h-4 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-fcTextDim">Address</p>
                    <p className="text-white font-medium text-[10px]">
                      {parent.address || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHILDREN CARDS */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-lg font-heading font-bold text-white">Children</h2>

            {parent.students.length === 0 ? (
              <div className="glass-card rounded-xl p-6 text-center">
                <p className="text-fcTextMuted">No children registered</p>
              </div>
            ) : (
              parent.students.map((student) => (
                <Link
                  key={student.id}
                  href={`/list/students/${student.id}`}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-fcGold/50 transition-all"
                >
                  <Image
                    src={
                      student.photo ||
                      "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg"
                    }
                    alt={`${student.firstName} ${student.lastName}`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-fcGold/30"
                  />
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-white">
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-fcGarnet/20 text-fcGarnet">
                        {student.ageGroup.name}
                      </span>
                      <span className="text-xs text-fcTextDim">
                        {student.position || "Player"}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {student.jerseyNumber ? `#${student.jerseyNumber}` : "⚽"}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM - CHILDREN DETAILS */}
        <div className="mt-4 glass-card rounded-2xl p-6">
          <h1 className="text-xl font-heading font-bold text-white mb-4">
            Contact Information
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-fcBlue/20 flex items-center justify-center">
                  <Image src="/mail.png" alt="" width={20} height={20} />
                </div>
                <div>
                  <p className="text-xs text-fcTextDim">Email Address</p>
                  <p className="text-white font-medium">{parent.email || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-fcGreen/20 flex items-center justify-center">
                  <Image src="/phone.png" alt="" width={20} height={20} />
                </div>
                <div>
                  <p className="text-xs text-fcTextDim">Phone Number</p>
                  <p className="text-white font-medium">{parent.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 md:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-fcGold/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-fcTextDim">Home Address</p>
                  <p className="text-white font-medium">{parent.address || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* SHORTCUTS */}
        <div className="glass-card rounded-2xl p-6">
          <h1 className="text-xl font-heading font-semibold text-white mb-4">
            Quick Actions
          </h1>

          <div className="flex gap-3 flex-wrap">
            <Link
              className="px-4 py-2.5 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-all text-xs text-white font-medium"
              href="/"
            >
              🏠 Pato Hornets
            </Link>

            {parent.students.map((student) => (
              <Link
                key={student.id}
                className="px-4 py-2.5 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-all text-xs text-white font-medium"
                href={`/list/students/${student.id}`}
              >
                👦 {student.firstName}
              </Link>
            ))}

            <Link
              className="px-4 py-2.5 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-all text-xs text-white font-medium"
              href="/list/parents"
            >
              👨‍👩‍👧‍👦 All Parents
            </Link>
          </div>
        </div>

        {/* PERFORMANCE */}
        <Performance />

        {/* ANNOUNCEMENTS */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleParentPage;