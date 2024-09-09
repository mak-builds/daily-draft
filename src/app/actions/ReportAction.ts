// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchPostsReportCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("post_reports")
      .select("*", { count: "exact" })
      .not("user_id", "is", null)
      .not("post_id", "is", null)
      .not("reason", "is", null);

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

export async function fetchPostsReport(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("post_reports")
      .select(
        "id, user_id!inner(username, email_id), post_id!inner(title), reason!inner(title) ,description, report_status, created_at"
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
      item.username = item.user_id?.username;
      item.user_email = item.user_id?.email_id;
      item.post_title = item.post_id?.title;
      item.report_reason = item.reason?.title;
      delete item.user_id;
      delete item.post_id;
      delete item.reason;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export const handlePostsReportStatus = async (payload: any) => {
  const supabase = createClient();
  try {
    const { error }: any = await supabase
      .from("post_reports")
      .update({
        report_status: payload.action,
      })
      .eq("id", payload.actionId);
    if (error) throw error.message;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export async function fetchUsersReportCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("user_reports")
      .select("*", { count: "exact" })
      .not("user_id", "is", null)
      .not("reported_user_id", "is", null)
      .not("reason", "is", null);

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

export async function fetchUsersReport(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("user_reports")
      .select(
        "id, user_id!inner(username, email_id), reported_user_id!inner(username, email_id), reason!inner(title) ,description, report_status, created_at"
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
      item.reportee_name = item.user_id?.username;
      item.reportee_email = item.user_id?.email_id;
      item.reporter_username = item.reported_user_id?.username;
      item.reporter_email = item.reported_user_id?.email_id;
      item.report_reason = item.reason?.title;
      delete item.user_id;
      delete item.reported_user_id;
      delete item.reason;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export const handleUsersReportStatus = async (payload: any) => {
  const supabase = createClient();
  try {
    const { error }: any = await supabase
      .from("user_reports")
      .update({
        report_status: payload.action,
      })
      .eq("id", payload.actionId);
    if (error) throw error.message;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export async function fetchCommentsReportCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("post_comment_reports")
      .select("*", { count: "exact" })
      .not("user_id", "is", null)
      .not("post_id", "is", null)
      .not("comment_id", "is", null)
      .not("reason", "is", null);

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

export async function fetchCommentsReport(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("post_comment_reports")
      .select(
        "id, user_id!inner(username, email_id), post_id!inner(title), comment_id!inner(comment_body), reason!inner(title) ,description, report_status, created_at"
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
      item.reportee_name = item.user_id?.username;
      item.reportee_email = item.user_id?.email_id;
      item.report_reason = item.reason?.title;
      item.post_title = item.post_id?.title;
      item.comment = item.comment_id?.comment_body;
      delete item.user_id;
      delete item.post_id;
      delete item.comment_id;
      delete item.reason;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export const handleCommentsReportStatus = async (payload: any) => {
  const supabase = createClient();
  try {
    const { error }: any = await supabase
      .from("post_comment_reports")
      .update({
        report_status: payload.action,
      })
      .eq("id", payload.actionId);
    if (error) throw error.message;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
