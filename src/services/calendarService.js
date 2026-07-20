import { supabase } from "../lib/supabaseClient";

const TABLE = "calendar_events";

export async function getCalendarEvents() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getCalendarEventByDate(eventDate) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("event_date", eventDate)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function createCalendarEvent(event) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(event)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCalendarEvent(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function upsertCalendarEvent(eventDate, eventType) {
  const existing = await getCalendarEventByDate(eventDate);

  if (!existing) {
    return createCalendarEvent({
      event_date: eventDate,
      event_type: eventType,
    });
  }

  return updateCalendarEvent(existing.id, {
    event_type: eventType,
  });
}

export async function deleteCalendarEvent(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) throw error;
}

export async function deleteCalendarEventByDate(eventDate) {
  const existing = await getCalendarEventByDate(eventDate);

  if (!existing) return;

  await deleteCalendarEvent(existing.id);
}
