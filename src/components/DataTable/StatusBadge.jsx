const VARIANT_CLASSES = {
  current: "bg-emerald-500 text-slate-900",
  plan: "bg-indigo-500 text-white",
};

export default function StatusBadge({ type, children }) {
  return (
    <span
      className={`${VARIANT_CLASSES[type]} text-[10px] font-bold tracking-wide rounded-full px-2 py-0.5 whitespace-nowrap`}
    >
      {children}
    </span>
  );
}
