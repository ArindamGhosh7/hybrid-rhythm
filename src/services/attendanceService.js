import { supabase } from "../lib/supabaseClient";
import { addDays, format, startOfWeek } from "date-fns";

export async function ensureCurrentWeekExists(existingWeeks, userId) {
  // Monday of this week
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Friday = Monday + 4 days
  const currentWeekEnd = format(addDays(monday, 4), "yyyy-MM-dd");

  const alreadyExists = existingWeeks.some(
    (week) => week.week_end_date === currentWeekEnd,
  );

  if (alreadyExists) {
    return existingWeeks;
  }

  const { data, error } = await supabase
    .from("attendance_weeks")
    .insert({
      user_id: userId,
      week_end_date: currentWeekEnd,
      present_days: null,
      eligible_days: 5,
    })
    .select()
    .single();

  if (error) throw error;

  return [...existingWeeks, data].sort(
    (a, b) => new Date(a.week_end_date) - new Date(b.week_end_date),
  );
}

export async function getAttendanceWeeks(userId) {
  const { data, error } = await supabase
    .from("attendance_weeks")
    .select("*")
    .eq("user_id", userId)
    .order("week_end_date");

  if (error) throw error;

  return data;
}

export async function updateAttendanceWeek(id, presentDays, userId) {
  const { error } = await supabase
    .from("attendance_weeks")
    .update({
      present_days: presentDays,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
