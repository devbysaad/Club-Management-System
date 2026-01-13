import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Prisma, Event } from "@prisma/client";


const EventListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Get user role from Clerk session claims
  const user = await currentUser();
  const role = (user?.publicMetadata?.role as string)?.toLowerCase();

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Type",
      accessor: "type",
    },
    {
      header: "Venue",
      accessor: "venue",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden lg:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden lg:table-cell",
    },
    ...(role?.toLowerCase() === "admin" || role?.toLowerCase() === "staff"
      ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
      : []),
  ];

  // Event type styling
  const eventTypeStyles: Record<string, { icon: string; bg: string; text: string }> = {
    TOURNAMENT: { icon: '🏆', bg: 'bg-fcGold/20', text: 'text-fcGold' },
    CELEBRATION: { icon: '🎉', bg: 'bg-fcGreen/20', text: 'text-fcGreen' },
    MEETING: { icon: '🤝', bg: 'bg-fcBlue/20', text: 'text-fcBlue' },
    TRIAL: { icon: '🎯', bg: 'bg-fcGarnet/20', text: 'text-fcGarnet' },
    FUNDRAISER: { icon: '💰', bg: 'bg-fcGold/20', text: 'text-fcGold' },
    OTHER: { icon: '📅', bg: 'bg-fcGreen/20', text: 'text-fcGreen' },
  };

  const renderRow = (item: Event) => {
    const eventStyle = eventTypeStyles[item.type] || eventTypeStyles.OTHER;

    return (
      <tr
        key={item.id}
        className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
      >
        <td className="flex items-center gap-4 p-4">
          <div className={`w-10 h-10 rounded-xl ${eventStyle.bg} flex items-center justify-center`}>
            <span className="text-lg">{eventStyle.icon}</span>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-white">{item.title}</h3>
            {item.description && (
              <p className="text-xs text-fcTextDim line-clamp-1">{item.description}</p>
            )}
          </div>
        </td>
        <td>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${eventStyle.bg} ${eventStyle.text}`}>
            {item.type}
          </span>
        </td>
        <td className="hidden md:table-cell text-fcTextMuted">{item.venue}</td>
        <td className="hidden md:table-cell">
          <span className="text-fcTextMuted text-xs">
            {new Intl.DateTimeFormat("en-US").format(item.date)}
          </span>
        </td>
        <td className="hidden lg:table-cell text-fcTextMuted">
          {item.startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </td>
        <td className="hidden lg:table-cell text-fcTextMuted">
          {item.endTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </td>
        {(role?.toLowerCase() === "admin" || role?.toLowerCase() === "staff") && (
          <td>
            <div className="flex items-center gap-2">
              <FormModal table="event" type="update" data={item} />
              <FormModal table="event" type="delete" id={item.id} />
            </div>
          </td>
        )}
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
              { venue: { contains: value, mode: "insensitive" } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: { ...query, isDeleted: false },
      orderBy: {
        date: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: { ...query, isDeleted: false } }),
  ]);

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">All Events</h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Tournaments, celebrations & more • {count} events
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
            {(role?.toLowerCase() === "admin" || role?.toLowerCase() === "staff") && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination totalPages={Math.ceil(count / ITEM_PER_PAGE)} />
    </div>
  );
};

export default EventListPage;
