import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import EventDialog from "./EventDialog";

import formatLocalDate from "../../utils/dateUtils/formatLocalDate";

export default function WorkCalendar({ calendarEvents, reloadCalendarEvents }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const modifiers = useMemo(() => {
    const toLocalDate = (dateString) => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    return {
      holiday: calendarEvents
        .filter((e) => e.event_type === "HOLIDAY")
        .map((e) => toLocalDate(e.event_date)),

      leave: calendarEvents
        .filter((e) => e.event_type === "LEAVE")
        .map((e) => toLocalDate(e.event_date)),

      wfh: calendarEvents
        .filter((e) => e.event_type === "WFH")
        .map((e) => toLocalDate(e.event_date)),
    };
  }, [calendarEvents]);

  function handleDayClick(day) {
    setSelectedDate(day);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setSelectedDate(null);
  }

  const selectedEvent = useMemo(() => {
    if (!selectedDate) return null;

    const date = formatLocalDate(selectedDate);
    return calendarEvents.find((e) => e.event_date === date) || null;
  }, [selectedDate, calendarEvents]);

  function getEvent(date) {
    const iso = formatLocalDate(date);

    return calendarEvents.find((e) => e.event_date === iso) || null;
  }

  return (
    <>
      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Work Calendar</h2>

          <p className="mt-1 text-sm text-slate-400">
            Configure Holidays, Leave and Work From Home days.
          </p>
        </div>

        <DayPicker
          mode="single"
          showOutsideDays
          selected={selectedDate}
          onSelect={handleDayClick}
          modifiers={modifiers}
          modifiersClassNames={{
            holiday:
              "border-b-[3px] border-[#e07a5f] bg-[#e07a5f]/15 text-white rounded-lg",

            leave:
              "border-b-[3px] border-[#ffd166] bg-[#ffd166]/15 text-white rounded-lg",

            wfh: "border-b-[3px] border-[#9381ff] bg-[#9381ff]/15 text-white rounded-lg",
          }}
          classNames={{
            months: "flex justify-center",
            month: "space-y-5",
            caption:
              "relative flex items-center justify-center text-lg font-semibold text-white",
            caption_label: "text-white",
            nav: "absolute right-0 flex gap-2",
            nav_button:
              "h-8 w-8 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors",
            chevron: "fill-[#8d99ae] stroke-[#8d99ae]",
            table: "w-full border-collapse",
            head_row: "",
            head_cell: "text-slate-400 font-medium text-sm p-2",
            row: "",
            cell: "h-12 w-12 text-center align-middle",
            day: "h-10 w-10 rounded-lg transition hover:bg-slate-700 text-white",
            selected: "ring-2 ring-emerald-400 bg-emerald-500 text-slate-900",
            today: "border border-emerald-500",
            outside: "text-slate-600",
          }}
        />

        <div className="mt-8 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#e07a5f]"></div>
            <span className="text-slate-300">Holiday</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#ffd166]"></div>
            <span className="text-slate-300">Leave</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#9381ff]"></div>
            <span className="text-slate-300">Work From Home</span>
          </div>
        </div>
      </div>

      <EventDialog
        open={dialogOpen}
        onClose={closeDialog}
        selectedDate={selectedDate}
        event={selectedEvent}
        reloadCalendarEvents={reloadCalendarEvents}
      />
    </>
  );
}
