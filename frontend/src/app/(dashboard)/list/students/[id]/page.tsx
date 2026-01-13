// INSTRUCTION: Replace src/app/(dashboard)/list/students/[id]/page.tsx with this

import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import Performance from "@/components/Performance";
import FeeGridWrapper from "@/components/FeeGridWrapper";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const studentId = params.id;

  // 🔴 REAL DATA FETCH
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      parent: true,
      ageGroup: {
        include: {
          coaches: {
            include: {
              coach: true,
            },
          },
        },
      },
      attendances: {
        include: {
          trainingSession: true,
        },
        take: 10,
        orderBy: {
          markedAt: "desc",
        },
      },
      dailyAttendance: {
        take: 30,
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-2">
            Student Not Found
          </h1>
          <p className="text-fcTextMuted">The student you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const parentId = student.parent.id;
  const ageGroupId = student.ageGroup.id;

  // Calculate attendance percentage
  const totalAttendances = student.attendances.length;
  const presentCount = student.attendances.filter(
    (a) => a.status === "PRESENT"
  ).length;
  const attendancePercentage =
    totalAttendances > 0
      ? Math.round((presentCount / totalAttendances) * 100)
      : 0;

  // Get current user
  const user = await currentUser();

  // Get current year for fee records
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Get current month's fee status
  const currentMonthFee = await prisma.playerFeeRecord.findFirst({
    where: {
      playerId: studentId,
      month: currentMonth,
      year: currentYear,
      isDeleted: false,
    },
    include: {
      feePlan: true,
    },
  });

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
                <Image
                  src={
                    student.photo ||
                    "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg"
                  }
                  alt=""
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover border-4 border-fcGold/30"
                />
                {student.jerseyNumber && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center border-2 border-fcBorder">
                    <span className="text-white font-bold text-sm">
                      #{student.jerseyNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-white mb-1">
                  {student.firstName} {student.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-fcGarnet/20 text-fcGarnet text-xs font-medium">
                    {student.position || "Player"}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-fcBlue/20 text-fcBlue text-xs font-medium">
                    {student.ageGroup.name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fcSurface flex items-center justify-center">
                    <Image src="/blood.png" alt="" width={14} height={14} />
                  </div>
                  <div>
                    <p className="text-fcTextDim">Blood Type</p>
                    <p className="text-white font-medium">{student.bloodType || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fcSurface flex items-center justify-center">
                    <Image src="/date.png" alt="" width={14} height={14} />
                  </div>
                  <div>
                    <p className="text-fcTextDim">Date of Birth</p>
                    <p className="text-white font-medium">
                      {student.dateOfBirth.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fcSurface flex items-center justify-center">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                  </div>
                  <div>
                    <p className="text-fcTextDim">Email</p>
                    <p className="text-white font-medium text-[10px]">
                      {student.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-fcSurface flex items-center justify-center">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                  </div>
                  <div>
                    <p className="text-fcTextDim">Phone</p>
                    <p className="text-white font-medium">{student.phone || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-fcGreen/20 flex items-center justify-center">
                <Image
                  src="/singleAttendance.png"
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-white">
                  {attendancePercentage}%
                </h1>
                <span className="text-xs text-fcTextMuted">Attendance Rate</span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-fcGarnet/20 flex items-center justify-center">
                <Image src="/singleBranch.png" alt="" width={20} height={20} />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-white">
                  {student.ageGroup.name}
                </h1>
                <span className="text-xs text-fcTextMuted">Age Group</span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-fcBlue/20 flex items-center justify-center">
                <Image src="/singleLesson.png" alt="" width={20} height={20} />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-white">
                  #{student.jerseyNumber || "—"}
                </h1>
                <span className="text-xs text-fcTextMuted">Jersey Number</span>
              </div>
            </div>

            {/* Fee Status Card */}
            <div className={`glass-card rounded-xl p-4 flex flex-col gap-3 ${currentMonthFee?.status === "PAID"
              ? "bg-fcGreen/10 border-2 border-fcGreen/30"
              : currentMonthFee?.status === "PARTIAL"
                ? "bg-fcGold/10 border-2 border-fcGold/30"
                : "bg-fcGarnet/10 border-2 border-fcGarnet/30"
              }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentMonthFee?.status === "PAID"
                ? "bg-fcGreen/20"
                : currentMonthFee?.status === "PARTIAL"
                  ? "bg-fcGold/20"
                  : "bg-fcGarnet/20"
                }`}>
                <span className="text-xl">
                  {currentMonthFee?.status === "PAID" ? "✓" : "💰"}
                </span>
              </div>
              <div>
                <h1 className={`text-lg font-heading font-bold ${currentMonthFee?.status === "PAID"
                  ? "text-fcGreen"
                  : currentMonthFee?.status === "PARTIAL"
                    ? "text-fcGold"
                    : "text-fcGarnet"
                  }`}>
                  {currentMonthFee?.status === "PAID"
                    ? "Paid"
                    : currentMonthFee?.status === "PARTIAL"
                      ? "Partial"
                      : currentMonthFee
                        ? "Unpaid"
                        : "No Record"}
                </h1>
                <span className="text-xs text-fcTextMuted">
                  {new Date().toLocaleDateString("en-US", { month: "long" })} Fee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM - SCHEDULE */}
        <div className="mt-4 glass-card rounded-2xl p-6 h-[800px]">
          <h1 className="text-xl font-heading font-bold text-white mb-4">
            Student&apos;s Schedule
          </h1>
          <BigCalendarContainer type="classId" id={ageGroupId} />
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

            <Link
              className="px-4 py-2.5 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-all text-xs text-white font-medium"
              href={`/list/parents/${parentId}`}
            >
              👨‍👩‍👦 Student Parent
            </Link>

            <Link
              className="px-4 py-2.5 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-all text-xs text-white font-medium"
              href={`/list/teachers?ageGroupId=${ageGroupId}`}
            >
              👨‍🏫 Student Coaches
            </Link>

            <Link
              className="px-4 py-2.5 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-all text-xs text-white font-medium"
              href={`/list/classes/${ageGroupId}`}
            >
              🏃 Age Group
            </Link>

            <Link
              className="px-4 py-2.5 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-all text-xs text-white font-medium"
              href={`/list/lessons?ageGroupId=${ageGroupId}`}
            >
              ⚽ Team Sessions
            </Link>
          </div>
        </div>

        {/* PERFORMANCE */}
        <Performance />

        {/* DAILY ATTENDANCE */}
        <div className="glass-card rounded-2xl p-6">
          <h1 className="text-xl font-heading font-semibold text-white mb-4">
            Daily Attendance
          </h1>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {student.dailyAttendance.length > 0 ? (
              student.dailyAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/30 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium text-sm">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-fcTextMuted text-xs mt-0.5">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${record.status === "PRESENT"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                      }`}
                  >
                    {record.status === "PRESENT" ? "✓ Present" : "✗ Absent"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-fcTextMuted text-sm text-center py-8">
                No attendance records yet
              </p>
            )}
          </div>
        </div>

        {/* FEE GRID - Admin/Staff Only */}
        {(user?.publicMetadata?.role?.toString().toLowerCase() === "admin" || user?.publicMetadata?.role?.toString().toLowerCase() === "staff") && (
          <FeeGridWrapper
            playerId={studentId}
            year={currentYear}
          />
        )}

        {/* ANNOUNCEMENTS */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;