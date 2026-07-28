import { useEffect, useState } from "react";

export default function AttendanceStepper({
  value,
  min = 0,
  max,
  disabled = false,
  onChange,
  showSaveButton = false,
}) {
  const [localValue, setLocalValue] = useState(value ?? 0);

  useEffect(() => {
    setLocalValue(value ?? 0);
  }, [value]);

  const currentValue = showSaveButton ? localValue : (value ?? 0);

  const dirty = showSaveButton && localValue !== (value ?? 0);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || currentValue <= min}
          onClick={() => {
            if (showSaveButton) {
              setLocalValue(currentValue - 1);
            } else {
              onChange(currentValue - 1);
            }
          }}
          className="
        flex h-9 w-9 items-center justify-center
        rounded-full
        border border-slate-600
        bg-slate-800
        text-slate-300
        transition-all
        duration-200
        hover:border-indigo-400
        hover:bg-indigo-500
        hover:text-white
        active:scale-95
        disabled:cursor-not-allowed
        disabled:hover:bg-slate-800
        disabled:hover:border-slate-600
      "
        >
          <span className="text-lg font-semibold leading-none">−</span>
        </button>

        <div
          className="
        flex h-9 min-w-[44px] items-center justify-center
        rounded-lg
        border border-slate-700
        bg-slate-900
        px-3
        text-base
        tabular-nums
        text-slate-100
      "
        >
          {currentValue}
        </div>

        <button
          type="button"
          disabled={disabled || currentValue >= max}
          onClick={() => {
            if (showSaveButton) {
              setLocalValue(currentValue + 1);
            } else {
              onChange(currentValue + 1);
            }
          }}
          className="
        flex h-9 w-9 items-center justify-center
        rounded-full
        border border-slate-600
        bg-slate-800
        text-slate-300
        transition-all
        duration-200
        active:scale-90
        disabled:cursor-not-allowed
        disabled:hover:bg-slate-800
        disabled:hover:border-slate-600
      "
        >
          <span className="text-lg font-semibold leading-none">+</span>
        </button>
      </div>

      {dirty && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(localValue)}
          className="
        mt-2
        rounded-lg
        bg-emerald-600
        px-5
        py-1.5
        text-xs
        font-semibold
        text-white
        transition-all
        duration-200
        hover:bg-emerald-500
        active:scale-95
        disabled:opacity-50
      "
        >
          ✓ Save
        </button>
      )}
    </div>
  );
}
