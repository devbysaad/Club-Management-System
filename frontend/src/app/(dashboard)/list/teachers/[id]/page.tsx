// src/app/(dashboard)/list/teachers/[id]/page.tsx
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const SingleTeacherPage = async ({ params }: { params: { id: string } }) => {
  const teacherId = params.id;

  // Fetch the coach with their age groups
  const coach = await prisma.coach.findUnique({
    where: { id: teacherId },
    include: {
      ageGroups: {
        include: {
          ageGroup: {
            include: {
              students: true, // Get all students in this age group
            },
          },
        },
      },
    },
  });

  if (!coach) {
    return <div className="p-4">Coach not found</div>;
  }

  // Extract all unique student IDs from all age groups this coach teaches
  const studentIds = coach.ageGroups
    .flatMap((cag) => cag.ageGroup.students)
    .map((student) => student.id);

  // Get unique age group IDs
  const ageGroupIds = coach.ageGroups.map((cag) => cag.ageGroup.id);

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={
                  coach.photo ||
                  "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {coach.firstName} {coach.lastName}
                </h1>
                {role === "admin" && (
                  <FormModal
                    table="teacher"
                    type="update"
                    data={{
                      id: coach.id,
                      username: coach.email?.split("@")[0] || "",
                      email: coach.email || "",
                      password: "password",
                      firstName: coach.firstName,
                      lastName: coach.lastName,
                      phone: coach.phone || "",
                      address: coach.address || "",
                      bloodType: coach.bloodType || "",
                      dateOfBirth: "2000-01-01",
                      sex: coach.sex.toLowerCase(),
                      img: coach.photo || "",
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Specialization: {coach.specialization.join(", ") || "—"}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{coach.bloodType || "—"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{coach.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{coach.email || "—"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{coach.phone || "—"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">—</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {coach.ageGroups.length}
                </h1>
                <span className="text-sm text-gray-400">Age Groups</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{studentIds.length}</h1>
                <span className="text-sm text-gray-400">Students</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{coach.sex}</h1>
                <span className="text-sm text-gray-400">Gender</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Coach&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Pato Hornets
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/students?coachId=${teacherId}`}
            >
              My Students ({studentIds.length})
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/classes?coachId=${teacherId}`}
            >
              My Age Groups ({coach.ageGroups.length})
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/lessons?coachId=${teacherId}`}
            >
              My Sessions
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;