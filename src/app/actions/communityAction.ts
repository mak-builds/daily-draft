"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchCommunitiesCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("communities")
      .select("*", { count: "exact" })
      .not("interests", "is", null);

    if (searchQuery !== "") {
      query = query.or(`name.ilike.%${searchQuery}%`);
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

export async function fetchMasterInterests() {
  const supabase = createClient();

  try {
    let query = supabase.from("master_interests").select("id, name");

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchCommunities(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("communities")
      .select(
        "id, name, description, status, follower_count, created_by, created_at, interests!inner(id, name)"
      )
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(`name.ilike.%${searchQuery}%`);
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
      // @ts-ignore
      item.interestsName = item.interests?.name;
      // @ts-ignore
      item.interestsId = item.interests?.id;
      // @ts-ignore
      delete item?.interests;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createCommunity(payload: any) {
  const supabase = createClient();

  const payloadData = {
    name: payload.name,
    interests: payload.interests,
    description: payload.description,
    created_by: "admin",
    status: "active",
  };

  try {
    const { error, data } = await supabase
      .from("communities")
      .insert(payloadData);

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateCommunity(payload: any) {
  const supabase = createClient();

  const payloadData = {
    name: payload.name,
    interests: payload.interests,
    description: payload.description,
  };

  try {
    const { error, data } = await supabase
      .from("communities")
      .update(payloadData)
      .eq("id", payload?.id);

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function DeleteCommunity(payload: any) {
  const supabase = createClient();

  try {
    const { error, data } = await supabase
      .from("communities")
      .delete()
      .eq("id", payload?.id);
    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? 100.0 : 0.0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
};

export async function fetchFollowersKPI(communityId: string) {
  const supabase = createClient();

  const now = new Date();
  const startOfCurrentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();
  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).toISOString();
  const endOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  ).toISOString();

  try {
    // New Followers This Month
    const { count: newFollowersCurrentMonth } = await supabase
      .from("community_followers")
      .select("*", { count: "exact" })
      .eq("community_id", communityId)
      .gte("created_at", startOfCurrentMonth);

    // New Followers Last Month
    const { count: newFollowersPrevMonth } = await supabase
      .from("community_followers")
      .select("*", { count: "exact" })
      .eq("community_id", communityId)
      .gte("created_at", startOfPreviousMonth)
      .lte("created_at", endOfPreviousMonth);

    const followersChange = calculatePercentageChange(
      newFollowersCurrentMonth ?? 0,
      newFollowersPrevMonth ?? 0
    );

    return {
      success: true,
      data: {
        currentMonth: newFollowersCurrentMonth,
        previousMonth: newFollowersPrevMonth,
        change: followersChange,
      },
    };
  } catch (error) {
    console.error("Error fetching followers KPI:", error);
    return { error: "Failed to fetch followers KPI" };
  }
}

export async function fetchCommunityPostsCount(payload: any) {
  const { searchQuery, filters, communityId } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("community_id", communityId)
      .not("user_id", "is", null)
      .not("community_id", "is", null)
      .not("interests", "is", null);

    if (searchQuery !== "") {
      query = query.or(`user_id.username.ilike.%${searchQuery}%`);
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

export async function fetchCommunityPosts(payload: any) {
  const supabase = createClient();

  const {
    searchQuery,
    startIndex,
    endIndex,
    sortOrder,
    sortField,
    filters,
    communityId,
  } = payload;

  try {
    let query = supabase
      .from("posts")
      .select(
        "id, title, user_id!inner(username), community_id!inner(name), status, post_by, created_at, interests!inner(id, name)"
      )
      .eq("community_id", communityId)
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(`user_id.username.ilike.%${searchQuery}%`);
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
      // @ts-ignore
      item.interestsName = item.interests?.name;
      // @ts-ignore
      item.interestsId = item.interests?.id;
      // @ts-ignore
      item.communityName = item.community_id?.name;
      // @ts-ignore
      item.username = item.user_id?.username;
      // @ts-ignore
      delete item?.interests;
      // @ts-ignore
      delete item?.user_id;
      // @ts-ignore
      delete item?.community_id;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}
