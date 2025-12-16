import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, subjectsData } from "@/lib/data";
import Image from "next/image";

type TrainingProgram = {
  id: number;
  name: string;
  teachers: string[];
};

const columns = [
  {
    header: "Program Name",
    accessor: "name",
  },
  {
    header: "Coaches",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const programNames: Record<string, { name: string; icon: string; color: string }> = {
  "Math": { name: "Tactical Training", icon: "🎯", color: "bg-fcGarnet/20 text-fcGarnet" },
  "English": { name: "Communication", icon: "🗣️", color: "bg-fcBlue/20 text-fcBlue" },
  "Physics": { name: "Strength & Conditioning", icon: "💪", color: "bg-fcGreen/20 text-fcGreen" },
  "Chemistry": { name: "Team Chemistry", icon: "🤝", color: "bg-fcGold/20 text-fcGold" },
  "Biology": { name: "Sports Science", icon: "🧬", color: "bg-fcGarnet/20 text-fcGarnet" },
  "History": { name: "Match Analysis", icon: "📊", color: "bg-fcBlue/20 text-fcBlue" },
  "Geography": { name: "Opposition Scouting", icon: "🔍", color: "bg-fcGreen/20 text-fcGreen" },
  "Art": { name: "Set Pieces", icon: "⚽", color: "bg-fcGold/20 text-fcGold" },
  "Music": { name: "Mental Conditioning", icon: "🧠", color: "bg-fcGarnet/20 text-fcGarnet" },
  "Literature": { name: "Leadership Training", icon: "👑", color: "bg-fcBlue/20 text-fcBlue" },
};

const TrainingProgramListPage = () => {
  const renderRow = (item: TrainingProgram) => {
    const program = programNames[item.name] || { name: item.name, icon: "📋", color: "bg-fcSurface text-fcTextMuted" };

    return (
      <tr
        key={item.id}
        className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
      >
        <td className="flex items-center gap-4 p-4">
          <div className={`w-10 h-10 rounded-xl ${program.color.split(' ')[0]} flex items-center justify-center`}>
            <span className="text-xl">{program.icon}</span>
          </div>
          <div>
            <span className="font-heading font-semibold text-white block">{program.name}</span>
            <span className="text-xs text-fcTextDim">Code: {item.name}</span>
          </div>
        </td>
        <td className="hidden md:table-cell">
          <div className="flex flex-wrap gap-1">
            {item.teachers.map((teacher, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-lg bg-fcSurface text-fcTextMuted text-xs border border-fcBorder"
              >
                {teacher}
              </span>
            ))}
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormModal table="subject" type="update" data={item} />
                <FormModal table="subject" type="delete" id={item.id} />
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
          <h1 className="text-xl font-heading font-bold text-white">Training Programs</h1>
          <p className="text-sm text-fcTextMuted mt-1">Manage training curriculum</p>
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
            {role === "admin" && <FormModal table="subject" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={subjectsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TrainingProgramListPage;
