// @ts-nocheck

"use server";

import { createClient } from "@/utils/supabase/server";
import { FunctionRegion } from "@supabase/supabase-js";

export async function fetchUsersCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("isAdmin", false);

    if (searchQuery !== "") {
      query = query.or(`username.ilike.%${searchQuery}%`);
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        if (item?.columnType === "Enum") {
          query = query.eq(item.column, item.value);
        } else {
          query = query.ilike(item.column, `%${item.value}%`);
        }
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
        "id, username, email_id, age_group, profession, country!inner(name), status, created_at"
      )
      .eq("isAdmin", false)
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(`username.ilike.%${searchQuery}%`);
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
        if (item?.columnType === "Enum") {
          query = query.eq(item.column, item.value);
        } else {
          query = query.ilike(item.column, `%${item.value}%`);
        }
      });
    }

    const { data, error } = await query;

    if (error) throw error.message;

    data.forEach((item) => {
      item.interestsName = item.interests?.name;
      item.interestsId = item.interests?.id;
      item.country = item.country?.name;
      delete item?.interests;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchAllUsers() {
  const supabase = createClient();

  try {
    let query = supabase.from("users").select("id").eq("isAdmin", false);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export const handleUserStatus = async (payload: any) => {
  const supabase = createClient();
  try {
    const { error }: any = await supabase
      .from("users")
      .update({
        status: payload.action,
      })
      .eq("id", payload.actionId);
    if (error) throw error.message;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const fetchUserDetail = async (payload: any) => {
  const supabase = createClient();
  try {
    const { error, data }: any = await supabase
      .from("users")
      .select("*")
      .eq("id", payload?.userId)
      .single();
    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: {} };
  }
};

export const fetchUserIntrests = async (payload: any) => {
  const supabase = createClient();

  try {
    let { error, data } = await supabase
      .from("user_interests")
      .select("interest(name)")
      .eq("user_id", payload?.userId);
    if (error) throw error.message;
    // @ts-ignore
    data = data.map((item) => item.interest?.name);

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const fetchUserSkills = async (payload: any) => {
  const supabase = createClient();

  try {
    let { error, data } = await supabase
      .from("user_skills")
      .select("skill(name)")
      .eq("user_id", payload?.userId);
    if (error) throw error.message;
    // @ts-ignore
    data = data.map((item) => item.skill?.name);

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const fetchUserPersonalityTraits = async (payload: any) => {
  const supabase = createClient();

  try {
    let { error, data } = await supabase
      .from("user_personality_traits")
      .select("traits(name)")
      .eq("user_id", payload?.userId);
    if (error) throw error.message;
    // @ts-ignore
    data = data.map((item) => item.traits?.name);

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const hardDeleteUsers = async (payload: any) => {
  const supabase = createClient();

  try {
    let query = supabase.functions.invoke("hard-delete-users", {
      body: JSON.stringify({ users: payload.users }),
      method: "POST",
      region: FunctionRegion.UsWest1,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const softDeleteUsers = async (payload: any) => {
  const supabase = createClient();

  try {
    let query = supabase.functions.invoke("soft-delete-users", {
      body: JSON.stringify({ users: payload.users }),
      method: "POST",
      region: FunctionRegion.UsWest1,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};
