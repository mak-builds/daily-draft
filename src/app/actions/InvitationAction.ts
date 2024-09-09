/* eslint-disable no-unused-vars */
"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchInvitationCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("user_invitations")
      .select("*", { count: "exact" });

    if (searchQuery !== "") {
      query = query.or(`email.ilike.%${searchQuery}%`);
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        if (item?.columnType === 'Enum') {
          query = query.eq(item.column, item.value);
        }
        else {
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

export async function fetchInvitation(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("user_invitations")
      .select(
        "id, email, referral_code, is_used, invited_by, used_at, created_at"
      )
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(`email.ilike.%${searchQuery}%`);
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
        if (item?.columnType === 'Enum') {
          query = query.eq(item.column, item.value);
        }
        else {
          query = query.ilike(item.column, `%${item.value}%`);
        }
      });
    }

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function AddInvitations(payload: any) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("user_invitations")
      .insert(payload);
    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function createInvitation(payload: any[]) {
  try {
    const results = await Promise.all(payload.map(async (email) => {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PRIVATE_USEPLUNK_SECRET_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email.email,
          subject: 'Invitation Mail',
          body: `Your Code IS ${email.referral_code}`,
        }),
      };

      try {
        const response = (await fetch('https://api.useplunk.com/v1/send', options));
        const jsonResponse = await response.json();
        if (response.status !== 200) {
          throw jsonResponse.message;
        }
        return { email, success: true };
      } catch (error) {
        return { email, success: false, error };
      }
    }));

    if (results.some((result) => !result.success)) {
      return { success: false, error: 'Some emails failed to send' };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
