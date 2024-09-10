"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export const emailSignIn = async (formData: any) => {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signInWithPassword(formData);
    if (error) {
      throw error.message;
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const emailSignup = async (payload: any) => {
  const supabase = createClient();
  const { email, password } = payload;
  console.log("payload", payload);

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `/auth/callback`,
      },
    });
    console.log("error", error);

    if (error) {
      throw error.message;
    }
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/auth/signin");
};
