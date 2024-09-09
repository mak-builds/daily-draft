"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchUsersCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("isAdmin", false);

    if (searchQuery !== "") {
      query = query.or(
        `username.ilike.%${searchQuery}%,email_id.ilike.%${searchQuery}%`
      );
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        query = query.ilike(item.column, `%${item.value}%`);
      });
    }

    const { count, error } = await query;
    if (error) throw error.message;
    return { success: true, count };
  } catch (error) {
    return { success: false, error, count: 0 };
  }
}

export async function fetchUsers(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("users")
      .select(
        "username, email_id, country, age_group, profession, created_at, status"
      )
      .eq("isAdmin", false)
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(
        `username.ilike.%${searchQuery}%,email_id.ilike.%${searchQuery}%`
      );
    }

    if (sortField !== "") {
      query = query.order(sortField, {
        ascending: sortOrder === "asc" ? true : false,
      });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        query = query.ilike(item.column, `%${item.value}%`);
      });
    }

    const { data, error } = await query;

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}
