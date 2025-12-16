import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { announcementsData, role } from "@/lib/data";
import Image from "next/image";

type Announcement = {
  id: number;
  title: string;
  class: string;
  date: string;
};

const columns = [
  {
    header: "Announcement",
    accessor: "title",
  },
  {
    header: "Team",
    accessor: "class",
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

// Type badges for announcements
const getTypeBadge = (title: string) => {
  if (title.toLowerCase().includes('match') || title.toLowerCase().includes('game')) {
    return { bg: 'bg-fcGarnet/20', text: 'text-fcGarnet', label: 'Match' };
  } else if (title.toLowerCase().includes('training') || title.toLowerCase().includes('session')) {
    return { bg: 'bg-fcBlue/20', text: 'text-fcBlue', label: 'Training' };
  } else {
    return { bg: 'bg-fcGold/20', text: 'text-fcGold', label: 'Club' };
  }
};

const AnnouncementListPage = () => {
  const renderRow = (item: Announcement) => {
    const typeBadge = getTypeBadge(item.title);

    return (
      <tr
        key={item.id}
        className="border-b border-[var(--border-light)] text-sm hover:bg-[var(--bg-surface)] transition-colors"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${typeBadge.bg} flex items-center justify-center`}>
              <span className="text-lg">📢</span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeBadge.bg} ${typeBadge.text}`}>
                {typeBadge.label}
              </span>
            </div>
          </div>
        </td>
        <td>
          <span className="px-3 py-1.5 rounded-lg bg-fcBlue/10 text-fcBlue text-xs font-medium">
            {item.class}
          </span>
        </td>
        <td className="hidden md:table-cell">
          <span className="text-[var(--text-muted)] text-xs bg-[var(--bg-surface)] px-2 py-1 rounded">
            {item.date}
          </span>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormModal table="announcement" type="update" data={item} />
                <FormModal table="announcement" type="delete" id={item.id} />
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-[var(--text-primary)]">
            Club News
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            All announcements and updates
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2 self-end">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] border border-[var(--border-color)] transition-colors">
              <Image src="/filter.png" alt="" width={14} height={14} className="opacity-60" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] border border-[var(--border-color)] transition-colors">
              <Image src="/sort.png" alt="" width={14} height={14} className="opacity-60" />
            </button>
            {role === "admin" && (
              <FormModal table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={announcementsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AnnouncementListPage;
