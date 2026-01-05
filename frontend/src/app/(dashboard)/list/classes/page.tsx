// INSTRUCTION: Save this as src/app/(dashboard)/list/classes/page.tsx

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Link from "next/link";

type Team = {
  id: string;
  name: string;
  capacity: number;
  minAge: number;
  maxAge: number;
  coachName: string;
  studentCount: number;
};

const columns = [
  {
    header: "Team",
    accessor: "name",
  },
  {
    header: "Squad Size",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Age Group",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Head Coach",
    accessor: "supervisor",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];


const renderRow = (item: Team) => (
  <tr
    key={item.id}
    className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center">
        <span className="text-white font-heading font-bold text-sm">
          {item.name}
        </span>
      </div>
      <span className="font-heading font-semibold text-white">
        {item.name}
      </span>
    </td>
    <td className="hidden md:table-cell">
      <div className="flex items-center gap-2">
        <span className="text-fcTextMuted">{item.studentCount}/{item.capacity}</span>
        <span className="text-xs text-fcTextDim">players</span>
      </div>
    </td>
    <td className="hidden md:table-cell">
      <span className="px-2 py-1 rounded-lg bg-fcGold/20 text-fcGold text-xs font-medium">
        {item.minAge}-{item.maxAge} years
      </span>
    </td>
    <td className="hidden md:table-cell text-fcTextMuted">{item.coachName}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link
          href={`/list/classes/${item.id}`}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-fcSky"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
        {role === "admin" && (
          <>
            <FormModal table="class" type="update" data={item} />
            <FormModal table="class" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);


const TeamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { coachId, page } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  // Build query
  const query: any = {};
  if (coachId) {
    query.coaches = {
      some: {
        coachId: coachId,
      },
    };
  }

  // Fetch real age groups from database with pagination
  const [ageGroups, totalCount] = await prisma.$transaction([
    prisma.ageGroup.findMany({
      where: query,
      include: {
        coaches: {
          include: {
            coach: true,
          },
          take: 1, // Get first coach as "head coach"
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.ageGroup.count({ where: query }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

  

  // Transform data for rendering
  const teamsData = ageGroups.map((ag) => ({
    id: ag.id,
    name: ag.name,
    capacity: ag.capacity,
    minAge: ag.minAge,
    maxAge: ag.maxAge,
    coachName: ag.coaches[0]
      ? `${ag.coaches[0].coach.firstName} ${ag.coaches[0].coach.lastName}`
      : "No Coach",
    studentCount: ag._count.students,
  }));

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">
            All Teams {coachId ? "(Coach's Teams)" : ""}
          </h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Manage club squads • {totalCount} teams
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-colors">
              <svg className="w-4 h-4 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-colors">
              <svg className="w-4 h-4 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
            {role === "admin" && <FormModal table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={teamsData} />
      {/* PAGINATION */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default TeamListPage;