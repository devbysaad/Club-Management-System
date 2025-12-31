// INSTRUCTION: Save this as src/app/(dashboard)/list/classes/[id]/page.tsx

import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Player = {
  id: string;
  name: string;
  displayId: string;
  position: string;
  jerseyNumber: number;
  age: number;
  parentName: string;
};

const columns = [
  {
    header: "Player Info",
    accessor: "info",
  },
  {
    header: "Player ID",
    accessor: "displayId",
    className: "hidden md:table-cell",
  },
  {
    header: "Position",
    accessor: "position",
    className: "hidden md:table-cell",
  },
  {
    header: "Jersey",
    accessor: "jersey",
    className: "hidden lg:table-cell",
  },
  {
    header: "Age",
    accessor: "age",
    className: "hidden lg:table-cell",
  },
  {
    header: "Parent/Guardian",
    accessor: "parent",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const TeamDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Fetch age group details
  const ageGroup = await prisma.ageGroup.findUnique({
    where: { id },
    include: {
      students: {
        include: {
          parent: true,
        },
        orderBy: {
          jerseyNumber: "asc",
        },
      },
      coaches: {
        include: {
          coach: true,
        },
      },
      _count: {
        select: {
          students: true,
        },
      },
    },
  });

  if (!ageGroup) {
    notFound();
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderRow = (item: Player) => (
    <tr
      key={item.id}
      className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center">
          <span className="text-white font-heading font-bold text-lg">
            {item.jerseyNumber}
          </span>
        </div>
        <div className="flex flex-col">
          <h3 className="font-heading font-semibold text-white">{item.name}</h3>
          <p className="text-xs text-fcTextMuted">{item.displayId}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <span className="px-2 py-1 rounded-lg bg-fcBlue/20 text-fcBlue text-xs font-medium">
          {item.displayId}
        </span>
      </td>
      <td className="hidden md:table-cell">
        <span className="px-2 py-1 rounded-lg bg-fcGold/20 text-fcGold text-xs font-medium">
          {item.position}
        </span>
      </td>
      <td className="hidden lg:table-cell text-center">
        <span className="text-fcTextMuted font-semibold">{item.jerseyNumber}</span>
      </td>
      <td className="hidden lg:table-cell text-fcTextMuted">{item.age} years</td>
      <td className="hidden xl:table-cell text-fcTextMuted">{item.parentName}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link
            href={`/list/students/${item.id}`}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-fcSky"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>
      </td>
    </tr>
  );

  // Transform data for rendering
  const playersData: Player[] = ageGroup.students.map((student) => ({
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    displayId: student.displayId || "—",
    position: student.position || "—",
    jerseyNumber: student.jerseyNumber || 0,
    age: calculateAge(student.dateOfBirth),
    parentName: `${student.parent.firstName} ${student.parent.lastName}`,
  }));

  const headCoach = ageGroup.coaches[0]
    ? `${ageGroup.coaches[0].coach.firstName} ${ageGroup.coaches[0].coach.lastName}`
    : "No Coach Assigned";

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* BACK BUTTON & HEADER */}
      <div className="flex items-center gap-4">
        <Link
          href="/list/classes"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-colors"
        >
          <svg className="w-5 h-5 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">
            {ageGroup.name} Team
          </h1>
          <p className="text-sm text-fcTextMuted">
            {ageGroup.minAge}-{ageGroup.maxAge} years • {ageGroup._count.students}/{ageGroup.capacity} players
          </p>
        </div>
      </div>

      {/* TEAM STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-fcBlue/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-fcBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-fcTextMuted">Total Players</p>
              <p className="text-xl font-heading font-bold text-white">{ageGroup._count.students}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-fcGold/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-fcGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-fcTextMuted">Capacity</p>
              <p className="text-xl font-heading font-bold text-white">{ageGroup.capacity}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-fcGarnet/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-fcGarnet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-fcTextMuted">Head Coach</p>
                <p className="text-sm font-heading font-semibold text-white truncate">{headCoach}</p>
              </div>
            </div>
            {ageGroup.coaches[0] && (
              <Link
                href={`/list/teachers/${ageGroup.coaches[0].coach.id}`}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-fcSky hover:bg-fcSky/80 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-fcSky/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-fcSky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-fcTextMuted">Age Range</p>
              <p className="text-xl font-heading font-bold text-white">{ageGroup.minAge}-{ageGroup.maxAge}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYERS LIST */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-white">Team Roster</h2>
            <p className="text-sm text-fcTextMuted mt-1">
              Complete squad list
            </p>
          </div>
        </div>
        
        {playersData.length > 0 ? (
          <Table columns={columns} renderRow={renderRow} data={playersData} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-fcSurface flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-fcTextMuted">No players assigned to this team yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetailPage;