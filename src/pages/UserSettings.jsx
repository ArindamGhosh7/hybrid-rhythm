import { useState } from "react";

export default function UserSettings({ currentUser, onClose, onSave }) {
  const [target, setTarget] = useState(String(currentUser?.ytd_target ?? 60));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const value = Number(target);

    if (!Number.isFinite(value)) {
      setError("Please enter a valid percentage.");
      return;
    }

    if (value < 50 || value > 100) {
      setError("YTD target must be between 50% and 100%.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave(value);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Unable to update YTD target.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Settings</h2>

            <p className="mt-1 text-sm text-slate-400">
              Customize your attendance target
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* YTD Target */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-300">
            YTD Attendance Target
          </label>

          <p className="mt-1 text-xs text-slate-500">
            This target is used for your dashboard, recovery plan, and chart.
          </p>

          <div className="relative mt-3">
            <input
              type="number"
              min="50"
              max="100"
              step="1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="
                w-full
                rounded-lg
                border border-slate-600
                bg-slate-900
                px-4 py-3 pr-12
                text-white
                outline-none
                focus:border-emerald-400
                focus:ring-1
                focus:ring-emerald-400
              "
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              %
            </span>
          </div>

          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              rounded-lg
              border border-slate-600
              px-4 py-2
              text-sm
              text-slate-300
              hover:bg-slate-700
              hover:text-white
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              rounded-lg
              bg-emerald-500
              px-4 py-2
              text-sm
              font-semibold
              text-slate-950
              hover:bg-emerald-400
              transition
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
