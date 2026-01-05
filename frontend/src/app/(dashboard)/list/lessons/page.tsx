// INSTRUCTION: Save this as src/app/(dashboard)/list/sessions/page.tsx
// Replace your existing sessions page with this

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Session = {
  id: string;
  title: string;
  type: string;
  ageGroupName: string;
  coachName: string;
  date: Date;
  venue: string;
};

const columns = [
  {
    header: "Session Type",
    accessor: "name",
  },
  {
    header: "Team",
    accessor: "class",
  },
  {
    header: "Coach",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const sessionTypeMapping: Record<string, { name: string; icon: string; color: string }> = {
  "TRAINING": { name: "Tactical Drill", icon: "🎯", color: "bg-fcGarnet/20" },
  "MATCH": { name: "Match Day", icon: "⚽", color: "bg-fcBlue/20" },
  "FRIENDLY": { name: "Friendly Match", icon: "🤝", color: "bg-fcGreen/20" },
  "TOURNAMENT": { name: "Tournament", icon: "🏆", color: "bg-fcGold/20" },
  "FITNESS": { name: "Fitness Session", icon: "💪", color: "bg-fcGarnet/20" },
  "RECOVERY": { name: "Recovery Session", icon: "🧘", color: "bg-fcBlue/20" },
};

const renderRow = (item: Session) => {
  const session = sessionTypeMapping[item.type] || {
    name: item.title,
    icon: "📋",
    color: "bg-fcSurface"
  };

  return (
    <tr
      key={item.id}
      className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
    >
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl ${session.color} flex items-center justify-center`}>
            <span className="text-xl">{session.icon}</span>
          </div>
          <div>
            <span className="font-heading font-semibold text-white block">{session.name}</span>
            <span className="text-xs text-fcTextDim">
              {item.date.toLocaleDateString()} • {item.venue}
            </span>
          </div>
        </div>
      </td>
      <td>
        <span className="px-2 py-1 rounded-lg bg-fcGarnet/20 text-fcGarnet text-xs font-medium">
          {item.ageGroupName}
        </span>
      </td>
      <td className="hidden md:table-cell text-fcTextMuted">{item.coachName}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="lesson" type="update" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const TrainingSessionListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, coachId, ageGroupId, search } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  // Build query
  const query: Prisma.TrainingSessionWhereInput = {};

  // Filter by coach
  if (coachId) {
    query.coachId = coachId;
  }

  // Filter by age group
  if (ageGroupId) {
    query.ageGroupId = ageGroupId;
  }

  // Add search functionality with improved multi-word search
  if (search) {
    const searchTerms = search.trim().split(/\s+/);
    
    if (searchTerms.length === 1) {
      // Single word search
      query.OR = [
        {
          title: {
            contains: searchTerms[0],
            mode: "insensitive",
          },
        },
        {
          venue: {
            contains: searchTerms[0],
            mode: "insensitive",
          },
        },
        {
          coach: {
            firstName: {
              contains: searchTerms[0],
              mode: "insensitive",
            },
          },
        },
        {
          coach: {
            lastName: {
              contains: searchTerms[0],
              mode: "insensitive",
            },
          },
        },
        {
          ageGroup: {
            name: {
              contains: searchTerms[0],
              mode: "insensitive",
            },
          },
        },
      ];
    } else {
      // Multi-word search
      const [firstTerm, ...restTerms] = searchTerms;
      const lastTerm = restTerms.join(" ");
      
      query.OR = [
        // Coach firstName + lastName
        {
          AND: [
            {
              coach: {
                firstName: {
                  contains: firstTerm,
                  mode: "insensitive",
                },
              },
            },
            {
              coach: {
                lastName: {
                  contains: lastTerm,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        // Coach lastName + firstName (reversed)
        {
          AND: [
            {
              coach: {
                lastName: {
                  contains: firstTerm,
                  mode: "insensitive",
                },
              },
            },
            {
              coach: {
                firstName: {
                  contains: lastTerm,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        // Title contains full search
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        // Venue contains full search
        {
          venue: {
            contains: search,
            mode: "insensitive",
          },
        },
        // Age group name
        {
          ageGroup: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }
  }

  // Fetch sessions with pagination
  const [sessions, totalCount] = await prisma.$transaction([
    prisma.trainingSession.findMany({
      where: query,
      include: {
        coach: true,
        ageGroup: true,
      },
      orderBy: {
        date: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.trainingSession.count({ where: query }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

  // Transform data for rendering
  const sessionsData = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    type: s.type,
    ageGroupName: s.ageGroup.name,
    coachName: `${s.coach.firstName} ${s.coach.lastName}`,
    date: s.date,
    venue: s.venue,
  }));

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">
            Training Sessions {coachId ? "(Coach's Sessions)" : ""}
          </h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Manage training schedule • {totalCount} sessions
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
            {role === "admin" && <FormModal table="lesson" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={sessionsData} />
      {/* PAGINATION */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default TrainingSessionListPage;