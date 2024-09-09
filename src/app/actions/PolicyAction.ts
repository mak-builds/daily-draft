// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchTermsCondition() {
  const supabase = createClient();

  try {
    let query = supabase
      .from("policies")
      .select("*")
      .select("id, terms_and_conditions, terms_and_conditions_html");

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createTermsCondition(payload: any) {
  const supabase = createClient();

  try {
    let query = supabase.from("policies").insert({
      terms_and_conditions: payload.text,
      terms_and_conditions_html: payload.html,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function updateTermsCondition(payload: any) {
  const supabase = createClient();

  try {
    let query = supabase
      .from("policies")
      .update({
        terms_and_conditions: payload.text,
        terms_and_conditions_html: payload.html,
      })
      .eq("id", payload?.id);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}
