import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Match = {
  id: string;
  title: string;
  opponent: string;
  date: Date;
  time: Date;
  venue: string;
  isHome: boolean;
  type: string;
  ageGroupName: string;
  isCompleted: boolean;
  goalsFor: number;
  goalsAgainst: number;
};

const columns = [
  {
    header: "Match",
    accessor: "name",
  },
  {
    header: "Team",
    accessor: "class",
  },
  {
    header: "Competition",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const fixtureTypeColors: Record<string, string> = {
  "LEAGUE": "bg-fcGarnet/20 text-fcGarnet",
  "CUP": "bg-fcGold/20 text-fcGold",
  "FRIENDLY": "bg-fcBlue/20 text-fcBlue",
  "TOURNAMENT": "bg-fcGreen/20 text-fcGreen",
};

const renderRow = (item: Match, role?: string) => {
  return (
    <tr
      key={item.id}
      className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
    >
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center">
            <span className="text-2xl">⚽</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-white">
                {item.isHome ? "FC Manager" : item.opponent}
              </span>
              <span className="text-fcTextDim">vs</span>
              <span className="font-heading font-semibold text-white">
                {item.isHome ? item.opponent : "FC Manager"}
              </span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${item.isHome ? 'bg-fcGreen/20 text-fcGreen' : 'bg-fcBlue/20 text-fcBlue'}`}>
              {item.isHome ? 'Home' : 'Away'}
            </span>
          </div>
        </div>
      </td>
      <td>
        <span className="px-2 py-1 rounded-lg bg-fcGarnet/20 text-fcGarnet text-xs font-medium">
          {item.ageGroupName}
        </span>
      </td>
      <td className="hidden md:table-cell">
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${fixtureTypeColors[item.type] || "bg-fcBlue/20 text-fcBlue"}`}>
          {item.type}
        </span>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-col">
          <span className="text-fcTextMuted">{item.date.toLocaleDateString()}</span>
          <span className="text-xs text-fcTextDim">
            {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="fixture" type="update" data={item} />
              <FormModal table="fixture" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const MatchListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ageGroupId, search } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  // Get user role from Clerk session claims
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Build query
  const query: Prisma.FixtureWhereInput = {};

  // Filter by age group
  if (ageGroupId) {
    query.ageGroupId = ageGroupId;
  }

  // Add search functionality
  if (search) {
    query.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        opponent: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        venue: {
          contains: search,
          mode: "insensitive",
        },
      },
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

  // Fetch fixtures with pagination
  const [fixtures, totalCount] = await prisma.$transaction([
    prisma.fixture.findMany({
      where: query,
      include: {
        ageGroup: true,
      },
      orderBy: {
        date: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.fixture.count({ where: query }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

  // Transform data for rendering
  const matchesData = fixtures.map((fixture) => ({
    id: fixture.id,
    title: fixture.title,
    opponent: fixture.opponent,
    date: fixture.date,
    time: fixture.time,
    venue: fixture.venue,
    isHome: fixture.isHome,
    type: fixture.type,
    ageGroupName: fixture.ageGroup.name,
    isCompleted: fixture.isCompleted,
    goalsFor: fixture.goalsFor,
    goalsAgainst: fixture.goalsAgainst,
  }));

  // Get unique fixture types for filter buttons
  const fixtureTypes = ["LEAGUE", "CUP", "FRIENDLY", "TOURNAMENT"];

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Match Fixtures</h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Upcoming matches and schedule • {totalCount} fixtures
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            {/* Competition Filter */}
            <div className="hidden lg:flex items-center gap-1 bg-fcSurface rounded-lg p-1 border border-fcBorder">
              {fixtureTypes.slice(0, 3).map((comp) => (
                <button
                  key={comp}
                  className="px-2 py-1 rounded text-[10px] font-medium text-fcTextMuted hover:text-white hover:bg-fcGarnet/20 transition-colors"
                >
                  {comp}
                </button>
              ))}
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-colors">
              <svg className="w-4 h-4 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            {role === "admin" && <FormModal table="fixture" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={matchesData} />
      {/* PAGINATION */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default MatchListPage;