import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/components/setting";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Prisma, Student } from "@prisma/client";

type Player = Student & {
  ageGroup: { name: string } | null;
};

const columns = [
  { header: "Player Info", accessor: "info" },
  { header: "Player ID", accessor: "displayId", className: "hidden md:table-cell" },
  { header: "Position", accessor: "position", className: "hidden md:table-cell" },
  { header: "Squad", accessor: "squad", className: "hidden md:table-cell" },
  { header: "Age Group", accessor: "ageGroup", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const positions = ["GK", "DEF", "MID", "FWD"] as const;

const positionColors: Record<string, string> = {
  GK: "bg-fcGold/20 text-fcGold",
  DEF: "bg-fcBlue/20 text-fcBlue",
  MID: "bg-fcGreen/20 text-fcGreen",
  FWD: "bg-fcGarnet/20 text-fcGarnet",
};

const renderRow = (item: Player, index: number) => {
  const position = item.position || "N/A";
  const squad = item.ageGroup?.name || "Academy";

  return (
    <tr
      key={item.id}
      className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="relative">
          <Image
            src={item.photo || "/noAvatar.png"}
            alt=""
            width={44}
            height={44}
            className="md:hidden xl:block w-11 h-11 rounded-full object-cover ring-2 ring-fcBlue/30"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-fcNavy rounded-full border-2 border-fcBorder flex items-center justify-center">
            <span className="text-[8px] font-bold text-fcGold">
              {item.jerseyNumber ?? index + 1}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="font-heading font-semibold text-white">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-fcTextMuted">
            {item.email || item.address || "No contact info"}
          </p>
        </div>
      </td>

      <td className="hidden md:table-cell text-fcTextMuted">
        <span className="px-2 py-1 rounded bg-fcSurface text-xs font-mono">
          #{item.displayId?.slice(-4) || "----"}
        </span>
      </td>

      <td className="hidden md:table-cell">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            positionColors[position] || "bg-fcSurface text-fcTextMuted"
          }`}
        >
          {position}
        </span>
      </td>

      <td className="hidden md:table-cell">
        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-fcSurface text-fcTextMuted border border-fcBorder">
          {squad}
        </span>
      </td>

      <td className="hidden lg:table-cell text-fcTextMuted">
        {item.ageGroup?.name || "-"}
      </td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-fcBlue/20 hover:bg-fcBlue/30 transition-colors">
              <svg
                className="w-4 h-4 text-fcBlue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </Link>

          {role === "admin" && (
            <FormModal table="student" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );
};

const PlayerListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const search = searchParams.search;
  const ageGroupId = searchParams.ageGroupId;

  const where: Prisma.StudentWhereInput = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { displayId: { contains: search, mode: "insensitive" } },
    ];
  }

  if (ageGroupId) {
    where.ageGroupId = ageGroupId;
  }

  const [students, totalCount] = await prisma.$transaction([
    prisma.student.findMany({
      where,
      include: { ageGroup: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">
            All Players
          </h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Manage your squad roster
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />

          <div className="flex items-center gap-2">
            {role === "admin" && <FormModal table="student" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table
        columns={columns}
        data={students}
        renderRow={(item, idx) => renderRow(item as Player, idx)}
      />

      {/* PAGINATION */}
      <div className="flex-shrink-0 mt-4">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default PlayerListPage;
