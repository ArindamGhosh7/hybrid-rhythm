import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./workCalendar.css";

import EventDialog from "./EventDialog";
import formatLocalDate from "../../utils/dateUtils/formatLocalDate";

const EVENT_META = {
  HOLIDAY: { label: "Holiday", detail: "Not eligible", tone: "holiday" },
  LEAVE: { label: "Leave", detail: "Not eligible", tone: "leave" },
  WFH: { label: "WFH", detail: "Planning context", tone: "wfh" },
};

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isWeekday(date) {
  return date.getDay() > 0 && date.getDay() < 6;
}

export default function WorkCalendar({
  calendarEvents,
  reloadCalendarEvents,
  currentUser,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState("month");
  const [officePlans, setOfficePlans] = useState(() => new Set());

  const eventsByDate = useMemo(
    () => new Map(calendarEvents.map((event) => [event.event_date, event])),
    [calendarEvents],
  );

  const modifiers = useMemo(() => {
    const datesFor = (type) =>
      calendarEvents
        .filter((event) => event.event_type === type)
        .map((event) => parseLocalDate(event.event_date));

    return {
      holiday: datesFor("HOLIDAY"),
      leave: datesFor("LEAVE"),
      wfh: datesFor("WFH"),
      officePlan: [...officePlans].map(parseLocalDate),
    };
  }, [calendarEvents, officePlans]);

  const selectedIso = formatLocalDate(selectedDate);
  const selectedEvent = eventsByDate.get(selectedIso) || null;
  const selectedIsWeekend = !isWeekday(selectedDate);
  const selectedIsPlanned = officePlans.has(selectedIso);

  const upcomingEvents = useMemo(() => {
    const today = formatLocalDate(new Date());
    return calendarEvents
      .filter((event) => event.event_date >= today)
      .slice(0, 4);
  }, [calendarEvents]);

  function toggleOfficePlan() {
    if (selectedIsWeekend || selectedEvent) return;

    setOfficePlans((current) => {
      const next = new Set(current);
      if (next.has(selectedIso)) next.delete(selectedIso);
      else next.add(selectedIso);
      return next;
    });
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  const selectionLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const selectionState = selectedEvent
    ? EVENT_META[selectedEvent.event_type]
    : selectedIsWeekend
      ? {
          label: "Weekend",
          detail: "Outside the standard workweek",
          tone: "weekend",
        }
      : selectedIsPlanned
        ? {
            label: "Office planned",
            detail: "Local planning draft",
            tone: "office",
          }
        : {
            label: "Available",
            detail: "No exception recorded",
            tone: "available",
          };

  return (
    <section
      className="calendar-workspace"
      aria-labelledby="work-calendar-title"
    >
      <header className="calendar-workspace-header">
        <div>
          <p className="eyebrow">Availability & planning</p>
          <h2 id="work-calendar-title">Make the next office day clear.</h2>
          <p>
            Select a day to plan an office visit locally or record an
            availability exception. Exceptions are saved; office plans stay in
            this browser tab.
          </p>
        </div>
        <div className="calendar-view-switch" aria-label="Calendar display">
          <button
            type="button"
            className={view === "month" ? "active" : ""}
            onClick={() => setView("month")}
            aria-pressed={view === "month"}
          >
            Month
          </button>
          <button
            type="button"
            className={view === "agenda" ? "active" : ""}
            onClick={() => setView("agenda")}
            aria-pressed={view === "agenda"}
          >
            Upcoming
          </button>
        </div>
      </header>

      <div className="calendar-insight-strip" aria-label="Calendar summary">
        <div>
          <strong>{officePlans.size}</strong>
          <span>office days planned locally</span>
        </div>
        <div>
          <strong>
            {
              calendarEvents.filter((event) => event.event_type !== "WFH")
                .length
            }
          </strong>
          <span>availability exceptions</span>
        </div>
        <div>
          <strong>
            {
              calendarEvents.filter((event) => event.event_type === "WFH")
                .length
            }
          </strong>
          <span>WFH context days</span>
        </div>
      </div>

      {view === "month" ? (
        <div className="calendar-layout">
          <div className="calendar-month-panel">
            <DayPicker
              mode="single"
              showOutsideDays
              selected={selectedDate}
              onSelect={(day) => day && setSelectedDate(day)}
              modifiers={modifiers}
              modifiersClassNames={{
                holiday: "calendar-day-event calendar-day-holiday",
                leave: "calendar-day-event calendar-day-leave",
                wfh: "calendar-day-event calendar-day-wfh",
                officePlan: "calendar-day-event calendar-day-office",
                weekend: "calendar-day-weekend",
              }}
              classNames={{
                months: "calendar-months",
                month: "calendar-month",
                caption: "calendar-caption",
                caption_label: "calendar-caption-label",
                nav: "calendar-nav",
                button_previous: "calendar-nav-button",
                button_next: "calendar-nav-button",
                table: "calendar-table",
                head_cell: "calendar-head-cell",
                cell: "calendar-cell",
                day: "calendar-day",
                selected: "calendar-day-selected",
                today: "calendar-day-today",
                outside: "calendar-day-outside",
              }}
            />
            <div className="calendar-legend" aria-label="Calendar states">
              <span>
                <i className="office" aria-hidden="true" />
                Office planned
              </span>
              <span>
                <i className="holiday" aria-hidden="true" />
                Holiday
              </span>
              <span>
                <i className="leave" aria-hidden="true" />
                Leave
              </span>
              <span>
                <i className="wfh" aria-hidden="true" />
                WFH context
              </span>
            </div>
          </div>

          <aside className="calendar-day-panel" aria-live="polite">
            <p className="eyebrow">Selected day</p>
            <h3>{selectionLabel}</h3>
            <span className={`day-state ${selectionState.tone}`}>
              {selectionState.label}
            </span>
            <p>{selectionState.detail}</p>
            {selectedEvent?.event_type === "WFH" && (
              <p className="calendar-policy-note">
                WFH is visible for planning context. Confirm your organization’s
                eligibility policy before relying on it.
              </p>
            )}
            {selectedIsWeekend ? (
              <p className="calendar-policy-note">
                Weekends are not eligible office days in this calendar.
              </p>
            ) : (
              <div className="calendar-day-actions">
                <button
                  type="button"
                  className="primary-button"
                  disabled={Boolean(selectedEvent)}
                  onClick={toggleOfficePlan}
                >
                  {selectedIsPlanned ? "Remove office plan" : "Plan office day"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setDialogOpen(true)}
                >
                  {selectedEvent ? "Edit exception" : "Add exception"}
                </button>
              </div>
            )}
            {selectedEvent && (
              <p className="calendar-action-hint">
                An exception takes priority over a local office plan.
              </p>
            )}
          </aside>
        </div>
      ) : (
        <div
          className="calendar-agenda"
          aria-label="Upcoming calendar exceptions"
        >
          <div className="agenda-heading">
            <h3>Upcoming exceptions</h3>
            <span>{upcomingEvents.length} shown</span>
          </div>
          {upcomingEvents.length ? (
            upcomingEvents.map((event) => {
              const meta = EVENT_META[event.event_type];
              return (
                <button
                  key={event.id ?? `${event.event_date}-${event.event_type}`}
                  type="button"
                  className="agenda-item"
                  onClick={() => {
                    setSelectedDate(parseLocalDate(event.event_date));
                    setView("month");
                  }}
                >
                  <time dateTime={event.event_date}>
                    {parseLocalDate(event.event_date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", weekday: "short" },
                    )}
                  </time>
                  <span className={`day-state ${meta.tone}`}>{meta.label}</span>
                  <small>{meta.detail}</small>
                </button>
              );
            })
          ) : (
            <p className="empty-agenda">
              No upcoming exceptions. Select Month to add one or start a local
              office plan.
            </p>
          )}
        </div>
      )}

      <EventDialog
        open={dialogOpen}
        onClose={closeDialog}
        selectedDate={selectedDate}
        event={selectedEvent}
        reloadCalendarEvents={reloadCalendarEvents}
        currentUser={currentUser}
      />
    </section>
  );
}
