import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { classesData, role } from "@/lib/data";
import Image from "next/image";

type Team = {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
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

const teamNames: Record<string, string> = {
  "1A": "First Team",
  "2B": "B Team",
  "3C": "U-21",
  "4B": "U-19",
  "5A": "U-17",
  "5B": "U-16",
  "6B": "U-15",
  "6C": "U-14",
  "6D": "U-13",
  "7A": "Academy",
};

const TeamListPage = () => {
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
          {teamNames[item.name] || item.name}
        </span>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <span className="text-fcTextMuted">{item.capacity}</span>
          <span className="text-xs text-fcTextDim">players</span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <span className="px-2 py-1 rounded-lg bg-fcGold/20 text-fcGold text-xs font-medium">
          U-{item.grade + 12}
        </span>
      </td>
      <td className="hidden md:table-cell text-fcTextMuted">{item.supervisor}</td>
      <td>
        <div className="flex items-center gap-2">
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

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">All Teams</h1>
          <p className="text-sm text-fcTextMuted mt-1">Manage club squads</p>
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
      <Table columns={columns} renderRow={renderRow} data={classesData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeamListPage;
