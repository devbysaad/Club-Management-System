import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Prisma, Announcement } from "@prisma/client";

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Priority",
      accessor: "priority",
      className: "hidden md:table-cell",
    },
    {
      header: "Target Roles",
      accessor: "targetRoles",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  // Priority badges
  const getPriorityBadge = (priority: number) => {
    if (priority >= 3) {
      return { bg: 'bg-fcGarnet/20', text: 'text-fcGarnet', label: 'High' };
    } else if (priority === 2) {
      return { bg: 'bg-fcGold/20', text: 'text-fcGold', label: 'Medium' };
    } else {
      return { bg: 'bg-fcBlue/20', text: 'text-fcBlue', label: 'Low' };
    }
  };

  const renderRow = (item: Announcement) => {
    const priorityBadge = getPriorityBadge(item.priority);

    return (
      <tr
        key={item.id}
        className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${priorityBadge.bg} flex items-center justify-center`}>
              <span className="text-lg">📢</span>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white">{item.title}</h3>
              {item.content && (
                <p className="text-xs text-fcTextDim line-clamp-1 mt-0.5">{item.content}</p>
              )}
            </div>
          </div>
        </td>
        <td className="hidden md:table-cell">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityBadge.bg} ${priorityBadge.text}`}>
            {priorityBadge.label}
          </span>
        </td>
        <td className="hidden lg:table-cell">
          <div className="flex flex-wrap gap-1">
            {item.targetRoles.map((targetRole, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-lg bg-fcBlue/20 text-fcBlue text-xs font-medium"
              >
                {targetRole}
              </span>
            ))}
          </div>
        </td>
        <td className="hidden md:table-cell">
          <span className="text-fcTextMuted text-xs">
            {new Intl.DateTimeFormat("en-US").format(item.publishedAt)}
          </span>
        </td>
        {role === "admin" && (
          <td>
            <div className="flex items-center gap-2">
              <FormModal table="announcement" type="update" data={item} />
              <FormModal table="announcement" type="delete" id={item.id} />
            </div>
          </td>
        )}
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              { content: { contains: value, mode: "insensitive" } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // Optional: Filter by current user's role
  // if (role && role !== "admin") {
  //   query.targetRoles = {
  //     has: role.toUpperCase() as any,
  //   };
  // }

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      orderBy: {
        publishedAt: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">
            All Announcements
          </h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Club news and updates • {count} announcements
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
            {role === "admin" && (
              <FormModal table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AnnouncementListPage;