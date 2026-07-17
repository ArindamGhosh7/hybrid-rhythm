import { supabase } from "../lib/supabaseClient";

export async function getAttendanceWeeks() {
  const { data, error } = await supabase
    .from("attendance_weeks")
    .select("*")
    .order("week_end_date");

  if (error) throw error;

  return data;
}

export async function updateAttendanceWeek(id, presentDays) {
  const { error } = await supabase
    .from("attendance_weeks")
    .update({
      present_days: presentDays,
    })
    .eq("id", id);

  if (error) throw error;
}
