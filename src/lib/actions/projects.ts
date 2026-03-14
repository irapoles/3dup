"use server";

import { createClient } from "@/lib/supabase/server";
import { createProjectSchema } from "@/lib/schemas/project";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types";
import type { Project } from "@/types/database";

export async function createProjectAction(
  formData: FormData,
): Promise<ActionResult<Project>> {
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "Failed to create project" };
  }

  return { success: true, data };
}

export async function getProjectsAction(): Promise<ActionResult<Project[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: "Failed to fetch projects" };
  return { success: true, data: data ?? [] };
}

export async function updateProjectAction(
  projectId: string,
  formData: FormData,
): Promise<ActionResult<null>> {
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    })
    .eq("id", projectId);

  if (error) return { success: false, error: "Failed to update project" };
  return { success: true, data: null };
}

export async function deleteProjectAction(
  projectId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) return { success: false, error: "Failed to delete project" };
  redirect("/projects");
}

export async function createProjectAssetAction(input: {
  projectId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  assetType: "logo" | "image" | "video";
}): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase.from("project_assets").insert({
    project_id: input.projectId,
    file_url: input.fileUrl,
    file_name: input.fileName,
    file_size: input.fileSize,
    asset_type: input.assetType,
  });

  if (error) return { success: false, error: "Failed to save asset" };
  return { success: true, data: null };
}

export async function deleteProjectAssetAction(
  assetId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("project_assets").delete().eq("id", assetId);
  if (error) return { success: false, error: "Failed to delete asset" };
  return { success: true, data: null };
}
