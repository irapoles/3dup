"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

export async function createRoomAssetAction(input: {
  roomId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  assetType: "render_t1" | "render_t2" | "render_t3";
}): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase.from("room_assets").insert({
    room_id: input.roomId,
    file_url: input.fileUrl,
    file_name: input.fileName,
    file_size: input.fileSize,
    asset_type: input.assetType,
    uploaded_by: user.id,
  });

  if (error) return { success: false, error: "Failed to save render" };
  return { success: true, data: null };
}

export async function deleteRoomAssetAction(
  assetId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("room_assets")
    .delete()
    .eq("id", assetId);

  if (error) return { success: false, error: "Failed to delete render" };
  return { success: true, data: null };
}

export async function reviewRoomAssetAction(
  assetId: string,
  status: "approved" | "rejected",
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: asset } = await supabase
    .from("room_assets")
    .select("uploaded_by, room_id")
    .eq("id", assetId)
    .single();

  const { error } = await supabase
    .from("room_assets")
    .update({ status })
    .eq("id", assetId);

  if (error) return { success: false, error: "Failed to update status" };

  if (asset?.uploaded_by) {
    await supabase.from("notifications").insert({
      user_id: asset.uploaded_by,
      type: `render_${status}`,
      title: `Render ${status}`,
      body: `Your render has been ${status}.`,
      link: null,
    });
  }

  return { success: true, data: null };
}

export async function markNotificationReadAction(
  notificationId: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) return { success: false, error: "Failed to mark as read" };
  return { success: true, data: null };
}
