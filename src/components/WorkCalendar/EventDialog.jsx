import { useEffect, useRef, useState } from "react";

import {
  deleteCalendarEventByDate,
  upsertCalendarEvent,
} from "../../services/calendarService";
import formatLocalDate from "../../utils/dateUtils/formatLocalDate";

const EVENT_OPTIONS = [
  {
    value: "HOLIDAY",
    label: "Holiday",
    description: "Not eligible for office attendance.",
    tone: "holiday",
  },
  {
    value: "LEAVE",
    label: "Leave",
    description: "Not eligible for office attendance.",
    tone: "leave",
  },
  {
    value: "WFH",
    label: "Work from home",
    description: "Planning context only; policy may vary.",
    tone: "wfh",
  },
];

export default function EventDialog({
  open,
  onClose,
  selectedDate,
  event,
  reloadCalendarEvents,
  currentUser,
}) {
  const [eventType, setEventType] = useState("");
  const [action, setAction] = useState(null);
  const dialogRef = useRef(null);
  const isProcessing = action !== null;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    setEventType(event?.event_type ?? "");
    dialogRef.current?.focus();

    function handleKeyDown(keyboardEvent) {
      if (keyboardEvent.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, event, onClose]);

  if (!open || !selectedDate) return null;

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const eventDate = formatLocalDate(selectedDate);

  async function handleSave() {
    if (!eventType) return;

    try {
      setAction("save");
      await upsertCalendarEvent(eventDate, eventType, currentUser.id);
      await reloadCalendarEvents();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to save calendar exception.");
    } finally {
      setAction(null);
    }
  }

  async function handleDelete() {
    if (!event || !window.confirm("Remove this calendar exception?")) return;

    try {
      setAction("delete");
      await deleteCalendarEventByDate(eventDate, currentUser.id);
      await reloadCalendarEvents();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to remove calendar exception.");
    } finally {
      setAction(null);
    }
  }

  return (
    <div
      className="calendar-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="calendar-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-dialog-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <p className="eyebrow">Availability exception</p>
          <h2 id="event-dialog-title">{formattedDate}</h2>
          <p>
            Choose one status for this date. Changes are saved to your calendar.
          </p>
        </header>

        <fieldset className="event-options" disabled={isProcessing}>
          <legend>What changes on this day?</legend>
          {EVENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`event-option ${option.tone} ${eventType === option.value ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="calendar-event"
                value={option.value}
                checked={eventType === option.value}
                onChange={(input) => setEventType(input.target.value)}
              />
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </fieldset>

        <footer>
          {event ? (
            <button
              type="button"
              className="danger-button"
              disabled={isProcessing}
              onClick={handleDelete}
            >
              {action === "delete" ? "Removing…" : "Remove"}
            </button>
          ) : (
            <span />
          )}
          <div>
            <button
              type="button"
              className="secondary-button"
              disabled={isProcessing}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="primary-button"
              disabled={isProcessing || !eventType}
              onClick={handleSave}
            >
              {action === "save" ? "Saving…" : "Save exception"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
