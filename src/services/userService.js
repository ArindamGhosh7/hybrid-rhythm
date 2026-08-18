import { supabase } from "../lib/supabaseClient";

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("hr_users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateUserYTDTarget(userId, targetPercentage) {
  const { data, error } = await supabase
    .from("hr_users")
    .update({
      ytd_target: targetPercentage,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
