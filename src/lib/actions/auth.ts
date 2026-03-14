"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas/auth";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function loginAction(
  formData: FormData,
): Promise<ActionResult<null>> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Please provide a valid email and password" };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { success: false, error: "Server configuration error. Please try again later." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: "Invalid email or password" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication failed" };
  }

  const role = user.user_metadata?.role;
  const destination = role === "admin" ? "/projects" : "/my-projects";

  redirect(destination);
}
