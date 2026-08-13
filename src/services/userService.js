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
