const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="overflow-x-auto rounded-xl mt-4">
      <table className="w-full pro-table">
        <thead>
          <tr className="border-b-2 border-[var(--border-color)]">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`
                  text-left py-4 px-4 
                  text-[11px] font-heading font-semibold 
                  text-[var(--text-muted)] uppercase tracking-wider
                  bg-[var(--bg-surface)]
                  first:rounded-tl-lg last:rounded-tr-lg
                  ${col.className}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)]">
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
