"use server";

import { createClient } from "@/utils/supabase/server";

export async function createDraft(payload: any) {
  const { title, html, text } = payload;
  const supabase = createClient();

  try {
    let query = supabase.from("posts").insert({
      title,
      content_text: text,
      content_html: html,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}
