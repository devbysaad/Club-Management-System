import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { examsData, role } from "@/lib/data";
import Image from "next/image";

type Match = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: string;
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

const opponents = ["Real Madrid", "Atletico Madrid", "Sevilla FC", "Valencia CF", "Real Betis", "Athletic Bilbao", "Real Sociedad", "Villarreal CF", "Celta Vigo", "Getafe CF"];
const competitions = ["La Liga", "Champions League", "Copa del Rey", "Supercopa"];

const MatchListPage = () => {
  const renderRow = (item: Match, index: number) => {
    const opponent = opponents[index % opponents.length];
    const competition = competitions[index % competitions.length];
    const isHome = index % 2 === 0;

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
                  {isHome ? "FC Manager" : opponent}
                </span>
                <span className="text-fcTextDim">vs</span>
                <span className="font-heading font-semibold text-white">
                  {isHome ? opponent : "FC Manager"}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${isHome ? 'bg-fcGreen/20 text-fcGreen' : 'bg-fcBlue/20 text-fcBlue'}`}>
                {isHome ? 'Home' : 'Away'}
              </span>
            </div>
          </div>
        </td>
        <td>
          <span className="px-2 py-1 rounded-lg bg-fcGarnet/20 text-fcGarnet text-xs font-medium">
            First Team
          </span>
        </td>
        <td className="hidden md:table-cell">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${competition === "Champions League" ? "bg-fcGold/20 text-fcGold" :
              competition === "La Liga" ? "bg-fcGarnet/20 text-fcGarnet" :
                "bg-fcBlue/20 text-fcBlue"
            }`}>
            {competition}
          </span>
        </td>
        <td className="hidden md:table-cell">
          <div className="flex flex-col">
            <span className="text-fcTextMuted">{item.date}</span>
            <span className="text-xs text-fcTextDim">21:00 CET</span>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role === "teacher") && (
              <>
                <FormModal table="exam" type="update" data={item} />
                <FormModal table="exam" type="delete" id={item.id} />
              </>
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
          <h1 className="text-xl font-heading font-bold text-white">Match Fixtures</h1>
          <p className="text-sm text-fcTextMuted mt-1">Upcoming matches and schedule</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            {/* Competition Filter */}
            <div className="hidden lg:flex items-center gap-1 bg-fcSurface rounded-lg p-1 border border-fcBorder">
              {competitions.slice(0, 3).map((comp) => (
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
            {(role === "admin" || role === "teacher") && <FormModal table="exam" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={(item) => renderRow(item, examsData.indexOf(item))} data={examsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default MatchListPage;
