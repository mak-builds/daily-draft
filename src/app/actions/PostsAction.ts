// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchPostsCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
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

export async function fetchPosts(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("posts")
      .select(
        "id, title, user_id(username), community_id!inner(id, name), status, post_by, created_at, interests!inner(id, name), body_html, body_text"
      )
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
      item.interestsName = item.interests?.name;
      item.interestsId = item.interests?.id;
      item.communityId = item.community_id?.id;
      item.communityName = item.community_id?.name;
      item.username = item.user_id?.username;
      delete item?.interests;
      delete item?.user_id;
      delete item?.community_id;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchMasterCommunities() {
  const supabase = createClient();

  try {
    let query = supabase.from("communities").select("id, name");

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createPost(payload: any) {
  const { title, interests, body_html, body_text, community } = payload
  const supabase = createClient();

  const payloadData = {
    title,
    interests,
    body_html,
    body_text,
    community_id: community,
    status: "active",
    post_by: "admin",
  };

  try {
    const { error, data } = await supabase
      .from("posts")
      .insert(payloadData);

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updatePost(payload: any) {
  const { title, interests, body_html, body_text, community, postId } = payload
  const supabase = createClient();

  const payloadData = {
    title,
    interests,
    body_html,
    body_text,
    community_id: community,
  };

  try {
    const { error, data } = await supabase
      .from("posts")
      .update(payloadData)
      .eq("id", postId);

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deletePost(payload: any) {
  const { postId } = payload;
  const supabase = createClient();

  try {
    const { error, data } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);
    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
