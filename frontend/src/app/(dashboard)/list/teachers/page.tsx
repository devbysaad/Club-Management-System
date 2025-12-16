import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { log } from "console";
import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    header: "Coach Info",
    accessor: "info",
  },
  {
    header: "Coach ID",
    accessor: "displayId",
    className: "hidden md:table-cell",
  },
  {
    header: "Specialty",
    accessor: "specialization",
    className: "hidden md:table-cell",
  },
  {
    header: "Teams",
    accessor: "ageGroups",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const CoachListPage = async ({ searchParams }: { searchParams: { [key: string]: string } | undefined }) => {

  console.log(searchParams)
  // Fetch coaches from database with their age groups
  const coaches = await prisma.coach.findMany({
    include: {
      ageGroups: {
        include: {
          ageGroup: true,
        },
      },
    },
    take: 10
  });

  const renderRow = (item: typeof coaches[0]) => (
    <tr
      key={item.id}
      className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="relative">
          <Image
            src={item.photo || '/noAvatar.png'}
            alt=""
            width={44}
            height={44}
            className="md:hidden xl:block w-11 h-11 rounded-xl object-cover ring-2 ring-fcGarnet/30"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-fcGreen rounded-full border-2 border-fcNavy" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-heading font-semibold text-white">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-fcTextMuted">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-fcTextMuted">
        <span className="px-2 py-1 rounded bg-fcSurface text-xs font-mono">
          {item.displayId || item.id.slice(0, 8)}
        </span>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {item.specialization.slice(0, 2).map((spec, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-fcBlue/20 text-fcBlue"
            >
              {spec}
            </span>
          ))}
          {item.specialization.length > 2 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-fcBlue/10 text-fcBlue">
              +{item.specialization.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {item.ageGroups.slice(0, 2).map((ag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-fcGarnet/20 text-fcGarnet"
            >
              {ag.ageGroup.name}
            </span>
          ))}
          {item.ageGroups.length > 2 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-fcGarnet/10 text-fcGarnet">
              +{item.ageGroups.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="hidden lg:table-cell text-fcTextMuted text-sm">{item.phone || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-fcBlue/20 hover:bg-fcBlue/30 transition-colors">
              <svg className="w-4 h-4 text-fcBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="h-screen glass-card rounded-2xl flex flex-col m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">All Coaches</h1>
          <p className="text-sm text-fcTextMuted mt-1">Manage your coaching staff ({coaches.length} total)</p>
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
              <FormModal table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* TABLE - Scrollable */}
      <div className="h-[80%] overflow-auto mt-4">
        <Table columns={columns} renderRow={renderRow} data={coaches} />
      </div>

      {/* PAGINATION */}
      <div className="flex-shrink-0 mt-4">
        <Pagination />
      </div>
    </div>
  );
};

export default CoachListPage;