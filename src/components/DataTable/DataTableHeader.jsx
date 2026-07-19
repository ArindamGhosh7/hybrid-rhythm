const COLUMNS = [
  { label: "Week End", align: "text-left" },
  { label: "Present", align: "text-center" },
  { label: "Eligible", align: "text-center" },
  { label: "Running Present", align: "text-center" },
  { label: "Running Eligible", align: "text-center" },
  { label: "Projected YTD", align: "text-center" },
  { label: "Recommendation", align: "text-center" },
];

export default function DataTableHeader() {
  return (
    <thead className="sticky top-0 z-20 bg-slate-900 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
      <tr>
        {COLUMNS.map((column) => (
          <th
            key={column.label}
            scope="col"
            className={`px-4 md:px-6 py-4 ${column.align}`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
