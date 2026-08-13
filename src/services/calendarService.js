import { supabase } from "../lib/supabaseClient";

const TABLE = "calendar_events";

export async function getCalendarEvents(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getCalendarEventByDate(eventDate, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("event_date", eventDate)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function createCalendarEvent(event, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...event,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCalendarEvent(id, updates, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function upsertCalendarEvent(eventDate, eventType, userId) {
  const existing = await getCalendarEventByDate(eventDate, userId);

  if (!existing) {
    return createCalendarEvent(
      {
        event_date: eventDate,
        event_type: eventType,
      },
      userId,
    );
  }

  return updateCalendarEvent(existing.id, { event_type: eventType }, userId);
}

export async function deleteCalendarEvent(id, userId) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteCalendarEventByDate(eventDate, userId) {
  const existing = await getCalendarEventByDate(eventDate, userId);

  if (!existing) return;

  await deleteCalendarEvent(existing.id, userId);
}
