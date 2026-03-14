"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createFreelancerSchema, updateFreelancerSchema } from "@/lib/schemas/freelancer";
import type { ActionResult } from "@/types";

export async function createFreelancerAction(
  formData: FormData,
): Promise<ActionResult<null>> {
  try {
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: (formData.get("phone") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      price: (formData.get("price") as string) || undefined,
    };

    const parsed = createFreelancerSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const admin = createAdminClient();

    const { data: authData, error: authError } =
      await admin.auth.admin.createUser({
        email: parsed.data.email,
        password: parsed.data.password,
        email_confirm: true,
        user_metadata: {
          role: "freelancer",
          name: parsed.data.name,
        },
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        return { success: false, error: "Email is already registered" };
      }
      return { success: false, error: authError.message || "Failed to create account" };
    }

    if (authData.user) {
      await admin.from("profiles").update({
        phone: parsed.data.phone ?? null,
        website: parsed.data.website ?? null,
        price: parsed.data.price ?? null,
      }).eq("id", authData.user.id);
    }

    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create freelancer" };
  }
}

export async function updateFreelancerAction(
  freelancerId: string,
  formData: FormData,
): Promise<ActionResult<null>> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    website: (formData.get("website") as string) || undefined,
    price: (formData.get("price") as string) || undefined,
  };

  const parsed = updateFreelancerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const admin = createAdminClient();

  const { error: authError } = await admin.auth.admin.updateUserById(
    freelancerId,
    { email: parsed.data.email },
  );
  if (authError) {
    return { success: false, error: "Failed to update email" };
  }

  const { error } = await admin.from("profiles").update({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    website: parsed.data.website ?? null,
    price: parsed.data.price ?? null,
  }).eq("id", freelancerId);

  if (error) return { success: false, error: "Failed to update profile" };
  return { success: true, data: null };
}

export async function deleteFreelancerAction(
  freelancerId: string,
): Promise<ActionResult<null>> {
  try {
    const admin = createAdminClient();
    await admin.from("project_freelancers").delete().eq("freelancer_id", freelancerId);
    await admin.from("notifications").delete().eq("user_id", freelancerId);
    await admin.from("room_assets").update({ uploaded_by: null }).eq("uploaded_by", freelancerId);
    const { error: profileError } = await admin.from("profiles").delete().eq("id", freelancerId);
    if (profileError) return { success: false, error: `Profile: ${profileError.message}` };
    const { error: authError } = await admin.auth.admin.deleteUser(freelancerId);
    if (authError) return { success: false, error: authError.message };
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete freelancer" };
  }
}

export async function assignFreelancerAction(
  projectId: string,
  freelancerId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("project_freelancers").insert({
    project_id: projectId,
    freelancer_id: freelancerId,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Freelancer is already assigned to this project" };
    }
    return { success: false, error: "Failed to assign freelancer" };
  }

  return { success: true, data: null };
}

export async function unassignFreelancerAction(
  projectId: string,
  freelancerId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_freelancers")
    .delete()
    .eq("project_id", projectId)
    .eq("freelancer_id", freelancerId);

  if (error) return { success: false, error: "Failed to remove assignment" };
  return { success: true, data: null };
}
