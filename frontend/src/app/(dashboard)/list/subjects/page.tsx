import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Prisma, TrainingSession, Coach, AgeGroup } from "@prisma/client";

type TrainingSessionList = TrainingSession & { 
  coach: Coach;
  ageGroup: AgeGroup;
};

const columns = [
  {
    header: "Session Name",
    accessor: "name",
  },
  {
    header: "Coach",
    accessor: "coach",
    className: "hidden md:table-cell",
  },
  {
    header: "Age Group",
    accessor: "ageGroup",
    className: "hidden lg:table-cell",
  },
  {
    header: "Date & Time",
    accessor: "datetime",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const sessionTypeIcons: Record<string, { icon: string; color: string }> = {
  "TRAINING": { icon: "🎯", color: "bg-fcGarnet/20 text-fcGarnet" },
  "MATCH": { icon: "⚽", color: "bg-fcGold/20 text-fcGold" },
  "FRIENDLY": { icon: "🤝", color: "bg-fcBlue/20 text-fcBlue" },
  "TOURNAMENT": { icon: "🏆", color: "bg-fcGreen/20 text-fcGreen" },
  "FITNESS": { icon: "💪", color: "bg-fcGarnet/20 text-fcGarnet" },
  "RECOVERY": { icon: "🧘", color: "bg-fcBlue/20 text-fcBlue" },
};

const renderRow = (item: TrainingSessionList) => {
  const sessionType = sessionTypeIcons[item.type] || { icon: "📋", color: "bg-fcSurface text-fcTextMuted" };
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(item.date));
  
  const formattedTime = new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).format(new Date(item.startTime));

  return (
    <tr
      key={item.id}
      className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
    >
      <td className="flex items-center gap-4 p-4">
        <div className={`w-10 h-10 rounded-xl ${sessionType.color.split(' ')[0]} flex items-center justify-center`}>
          <span className="text-xl">{sessionType.icon}</span>
        </div>
        <div>
          <span className="font-heading font-semibold text-white block">{item.title}</span>
          <span className="text-xs text-fcTextDim">{item.type}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <span className="px-2 py-1 rounded-lg bg-fcSurface text-fcTextMuted text-xs border border-fcBorder">
          {item.coach.firstName} {item.coach.lastName}
        </span>
      </td>
      <td className="hidden lg:table-cell">
        <span className="px-2 py-1 rounded-lg bg-fcBlue/20 text-fcBlue text-xs font-medium">
          {item.ageGroup.name}
        </span>
      </td>
      <td className="hidden xl:table-cell text-fcTextMuted">
        <div className="flex flex-col">
          <span className="text-xs">{formattedDate}</span>
          <span className="text-xs text-fcTextDim">{formattedTime}</span>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="trainingSession" type="update" data={item} />
              <FormModal table="trainingSession" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const TrainingProgramListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.TrainingSessionWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            const searchTerms = value.trim().split(/\s+/);
            
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
              // Multi-word search for coach names
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
                    contains: value,
                    mode: "insensitive",
                  },
                },
                // Venue contains full search
                {
                  venue: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
                // Age group name contains full search
                {
                  ageGroup: {
                    name: {
                      contains: value,
                      mode: "insensitive",
                    },
                  },
                },
              ];
            }
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
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
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.trainingSession.count({ where: query }),
  ]);

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Training Sessions</h1>
          <p className="text-sm text-fcTextMuted mt-1">Manage training schedule • {count} sessions</p>
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
            {role === "admin" && <FormModal table="trainingSession" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default TrainingProgramListPage;