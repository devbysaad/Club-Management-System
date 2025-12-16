import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Player = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
};

const columns = [
  {
    header: "Player Info",
    accessor: "info",
  },
  {
    header: "Player ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Position",
    accessor: "position",
    className: "hidden md:table-cell",
  },
  {
    header: "Squad",
    accessor: "squad",
    className: "hidden md:table-cell",
  },
  {
    header: "Age Group",
    accessor: "grade",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const positions = ["GK", "DEF", "MID", "FWD"];
const positionColors: Record<string, string> = {
  GK: "bg-fcGold/20 text-fcGold",
  DEF: "bg-fcBlue/20 text-fcBlue",
  MID: "bg-fcGreen/20 text-fcGreen",
  FWD: "bg-fcGarnet/20 text-fcGarnet",
};

const squads = ["First Team", "B Team", "U-21", "U-19", "U-17", "Academy"];

const PlayerListPage = () => {
  const renderRow = (item: Player, index: number) => {
    const position = positions[index % 4];
    const squad = squads[index % 6];

    return (
      <tr
        key={item.id}
        className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="relative">
            <Image
              src={item.photo}
              alt=""
              width={44}
              height={44}
              className="md:hidden xl:block w-11 h-11 rounded-xl object-cover ring-2 ring-fcBlue/30"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-fcNavy rounded-full border-2 border-fcBorder flex items-center justify-center">
              <span className="text-[8px] font-bold text-fcGold">
                {(index % 30) + 1}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-heading font-semibold text-white">{item.name}</h3>
            <p className="text-xs text-fcTextMuted">{item?.email || item.class}</p>
          </div>
        </td>
        <td className="hidden md:table-cell text-fcTextMuted">
          <span className="px-2 py-1 rounded bg-fcSurface text-xs font-mono">
            #{item.studentId.slice(-4)}
          </span>
        </td>
        <td className="hidden md:table-cell">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${positionColors[position]}`}>
            {position}
          </span>
        </td>
        <td className="hidden md:table-cell">
          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-fcSurface text-fcTextMuted border border-fcBorder">
            {squad}
          </span>
        </td>
        <td className="hidden lg:table-cell">
          <span className="text-fcTextMuted">U-{item.grade + 13}</span>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/students/${item.id}`}>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-fcBlue/20 hover:bg-fcBlue/30 transition-colors">
                <svg className="w-4 h-4 text-fcBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">All Players</h1>
          <p className="text-sm text-fcTextMuted mt-1">Manage your squad roster</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            {/* Position Filter */}
            <div className="hidden lg:flex items-center gap-1 bg-fcSurface rounded-lg p-1 border border-fcBorder">
              {positions.map((pos) => (
                <button
                  key={pos}
                  className="px-2 py-1 rounded text-[10px] font-medium text-fcTextMuted hover:text-white hover:bg-fcGarnet/20 transition-colors"
                >
                  {pos}
                </button>
              ))}
            </div>
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
              <FormModal table="student" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-4 mt-4 mb-2">
        {positions.map((pos) => (
          <div key={pos} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${positionColors[pos].split(' ')[0]}`} />
            <span className="text-xs text-fcTextMuted">{pos}</span>
          </div>
        ))}
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={(item) => renderRow(item, studentsData.indexOf(item))} data={studentsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default PlayerListPage;
