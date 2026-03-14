"use server";

import { createClient } from "@/lib/supabase/server";
import { createApartmentSchema, updateApartmentSchema } from "@/lib/schemas/apartment";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types";
import type { Apartment } from "@/types/database";

export async function createApartmentAction(
  projectId: string,
  formData: FormData,
): Promise<ActionResult<Apartment>> {
  const roomsRaw = formData.get("rooms") as string;
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    rooms: roomsRaw ? JSON.parse(roomsRaw) : [],
  };

  const parsed = createApartmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: apartment, error } = await supabase
    .from("apartments")
    .insert({
      project_id: projectId,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    })
    .select()
    .single();

  if (error || !apartment) {
    return { success: false, error: "Failed to create apartment" };
  }

  if (parsed.data.rooms.length > 0) {
    const roomInserts = parsed.data.rooms.map((roomName) => ({
      apartment_id: apartment.id,
      name: roomName,
    }));

    const { error: roomError } = await supabase.from("rooms").insert(roomInserts);
    if (roomError) {
      return { success: false, error: "Apartment created but failed to add rooms" };
    }
  }

  return { success: true, data: apartment };
}

export async function updateApartmentAction(
  apartmentId: string,
  formData: FormData,
): Promise<ActionResult<null>> {
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = updateApartmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("apartments")
    .update({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    })
    .eq("id", apartmentId);

  if (error) return { success: false, error: "Failed to update apartment" };
  return { success: true, data: null };
}

export async function deleteApartmentAction(
  apartmentId: string,
  projectId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("apartments").delete().eq("id", apartmentId);
  if (error) return { success: false, error: "Failed to delete apartment" };
  redirect(`/projects/${projectId}`);
}

export async function addRoomAction(
  apartmentId: string,
  name: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").insert({
    apartment_id: apartmentId,
    name,
  });
  if (error) return { success: false, error: "Failed to add room" };
  return { success: true, data: null };
}

export async function deleteRoomAction(
  roomId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) return { success: false, error: "Failed to delete room" };
  return { success: true, data: null };
}

export async function createApartmentAssetAction(input: {
  apartmentId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  assetType: "blueprint" | "moodboard_t1" | "moodboard_t2" | "moodboard_t3";
}): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("apartment_assets").insert({
    apartment_id: input.apartmentId,
    file_url: input.fileUrl,
    file_name: input.fileName,
    file_size: input.fileSize,
    asset_type: input.assetType,
  });
  if (error) return { success: false, error: "Failed to save asset" };
  return { success: true, data: null };
}

export async function deleteApartmentAssetAction(
  assetId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("apartment_assets").delete().eq("id", assetId);
  if (error) return { success: false, error: "Failed to delete asset" };
  return { success: true, data: null };
}
