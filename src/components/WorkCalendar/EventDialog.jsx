import { useEffect, useState } from "react";

import {
  deleteCalendarEventByDate,
  upsertCalendarEvent,
} from "../../services/calendarService";
import formatLocalDate from "../../utils/dateUtils/formatLocalDate";

export default function EventDialog({
  open,
  onClose,
  selectedDate,
  event,
  reloadCalendarEvents,
}) {
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    if (!open) return;

    if (event) {
      setEventType(event.event_type);
    } else {
      setEventType("");
    }
  }, [open, event]);

  if (!open || !selectedDate) return null;

  const formattedDate = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const eventDate = formatLocalDate(selectedDate);

  async function handleSave() {
    if (!eventType) {
      alert("Please select an event type.");
      return;
    }

    try {
      await upsertCalendarEvent(eventDate, eventType);

      await reloadCalendarEvents();

      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to save calendar event.");
    }
  }

  async function handleDelete() {
    if (!event) return;

    if (!window.confirm("Delete this event?")) {
      return;
    }

    try {
      await deleteCalendarEventByDate(eventDate);

      await reloadCalendarEvents();

      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to delete calendar event.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="border-b border-slate-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Work Calendar</h2>

          <p className="mt-2 text-sm text-slate-400">{formattedDate}</p>
        </div>

        <div className="space-y-4 px-6 py-6">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-4 hover:border-red-500">
            <input
              type="radio"
              value="HOLIDAY"
              checked={eventType === "HOLIDAY"}
              onChange={(e) => setEventType(e.target.value)}
            />

            <div>
              <div className="font-medium text-white">Holiday</div>

              <div className="text-sm text-slate-400">
                Office attendance not required.
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-4 hover:border-amber-500">
            <input
              type="radio"
              value="LEAVE"
              checked={eventType === "LEAVE"}
              onChange={(e) => setEventType(e.target.value)}
            />

            <div>
              <div className="font-medium text-white">Leave</div>

              <div className="text-sm text-slate-400">Personal leave.</div>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-4 hover:border-blue-500">
            <input
              type="radio"
              value="WFH"
              checked={eventType === "WFH"}
              onChange={(e) => setEventType(e.target.value)}
            />

            <div>
              <div className="font-medium text-white">Work From Home</div>

              <div className="text-sm text-slate-400">
                Office attendance not required.
              </div>
            </div>
          </label>
        </div>

        <div className="flex justify-between border-t border-slate-700 px-6 py-4">
          <div>
            {event && (
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
