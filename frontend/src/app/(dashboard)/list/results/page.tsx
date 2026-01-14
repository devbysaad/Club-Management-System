export const dynamic = "force-dynamic";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type MatchResult = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  student: string;
  type: "exam" | "assignment";
  date: string;
  score: number;
};

const columns = [
  {
    header: "Match",
    accessor: "name",
  },
  {
    header: "Result",
    accessor: "score",
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

const MatchResultListPage = async () => {
  // Get user role from Clerk session claims
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // TODO: Replace with real Prisma query for match results
  const resultsData: MatchResult[] = [];

  const renderRow = (item: MatchResult, index: number) => {
    const opponent = opponents[index % opponents.length];
    const competition = competitions[index % competitions.length];
    const homeScore = Math.floor(Math.random() * 4) + 1;
    const awayScore = Math.floor(Math.random() * 3);
    const isWin = homeScore > awayScore;
    const isDraw = homeScore === awayScore;

    return (
      <tr
        key={item.id}
        className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
      >
        <td className="p-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${isWin ? 'bg-fcGreen/20' : isDraw ? 'bg-fcGold/20' : 'bg-fcGarnet/20'} flex items-center justify-center`}>
              <span className={`text-lg font-bold ${isWin ? 'text-fcGreen' : isDraw ? 'text-fcGold' : 'text-fcGarnet'}`}>
                {isWin ? 'W' : isDraw ? 'D' : 'L'}
              </span>
            </div>
            <div>
              <span className="font-heading font-semibold text-white block">
                FC Manager vs {opponent}
              </span>
              <span className="text-xs text-fcTextDim">Home Match</span>
            </div>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-heading font-bold ${isWin ? 'text-fcGreen' : isDraw ? 'text-fcGold' : 'text-fcGarnet'}`}>
              {homeScore} - {awayScore}
            </span>
          </div>
        </td>
        <td className="hidden md:table-cell">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${competition === "Champions League" ? "bg-fcGold/20 text-fcGold" :
            competition === "La Liga" ? "bg-fcGarnet/20 text-fcGarnet" :
              "bg-fcBlue/20 text-fcBlue"
            }`}>
            {competition}
          </span>
        </td>
        <td className="hidden md:table-cell text-fcTextMuted">{item.date}</td>
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role === "teacher") && (
              <>
                <FormModal table="result" type="update" data={item} />
                <FormModal table="result" type="delete" id={item.id} />
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
          <h1 className="text-xl font-heading font-bold text-white">Match Results</h1>
          <p className="text-sm text-fcTextMuted mt-1">Season match history</p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fcGreen/10 border border-fcGreen/20">
            <span className="text-xs text-fcGreen font-medium">W: 28</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fcGold/10 border border-fcGold/20">
            <span className="text-xs text-fcGold font-medium">D: 8</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fcGarnet/10 border border-fcGarnet/20">
            <span className="text-xs text-fcGarnet font-medium">L: 4</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4">
        <TableSearch />
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-colors">
            <svg className="w-4 h-4 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          {(role === "admin" || role === "teacher") && <FormModal table="result" type="create" />}
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={(item) => renderRow(item, resultsData.indexOf(item))} data={resultsData} />
      {/* PAGINATION */}
      <Pagination totalPages={1} />
    </div>
  );
};

export default MatchResultListPage;
