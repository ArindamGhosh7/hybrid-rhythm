import { useEffect, useState } from "react";

export default function AttendanceStepper({
  value,
  min = 0,
  max,
  disabled = false,
  onChange,
  showSaveButton = false,
  compact = false,
}) {
  const [localValue, setLocalValue] = useState(value ?? 0);

  useEffect(() => {
    setLocalValue(value ?? 0);
  }, [value]);

  const currentValue = showSaveButton ? localValue : (value ?? 0);

  const dirty = showSaveButton && localValue !== (value ?? 0);

  const buttonSize = compact ? "h-7 w-7" : "h-14 w-14";
  const iconSize = compact ? "text-base" : "text-2xl";
  const outputSize = compact
    ? "h-7 min-w-[36px] px-2 text-base"
    : "h-14 min-w-[76px] px-5 text-2xl";

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center ${compact ? "gap-1.5" : "gap-3"}`}
        role="group"
        aria-label="Office attendance days"
      >
        <button
          type="button"
          aria-label="Decrease attendance days"
          disabled={disabled || currentValue <= min}
          onClick={() => {
            if (showSaveButton) {
              setLocalValue(currentValue - 1);
            } else {
              onChange(currentValue - 1);
            }
          }}
          className={`
        flex ${buttonSize} items-center justify-center
        rounded-full
        border border-slate-500
        bg-slate-800
        text-slate-200
        shadow-sm shadow-slate-950/40
        transition-all
        duration-200
        hover:border-teal-300
        hover:bg-teal-500
        hover:text-slate-950
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-slate-800
        disabled:hover:border-slate-500
      `}
        >
          <span className={`${iconSize} font-semibold leading-none`}>−</span>
        </button>

        <output
          aria-live="polite"
          aria-label={`${currentValue} attendance days`}
          className={`
        flex ${outputSize} items-center justify-center
        rounded-xl
        border border-slate-600
        bg-slate-950/70
        font-bold
        tabular-nums
        text-slate-50
        shadow-inner shadow-slate-950/60
      `}
        >
          {currentValue}
        </output>

        <button
          type="button"
          aria-label="Increase attendance days"
          disabled={disabled || currentValue >= max}
          onClick={() => {
            if (showSaveButton) {
              setLocalValue(currentValue + 1);
            } else {
              onChange(currentValue + 1);
            }
          }}
          className={`
        flex ${buttonSize} items-center justify-center
        rounded-full
        border border-slate-500
        bg-slate-800
        text-slate-200
        shadow-sm shadow-slate-950/40
        transition-all
        duration-200
        hover:border-teal-300
        hover:bg-teal-500
        hover:text-slate-950
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-slate-800
        disabled:hover:border-slate-500
      `}
        >
          <span className={`${iconSize} font-semibold leading-none`}>+</span>
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
