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
    status: "to_do",
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

export type RoomAssetStatus = "to_do" | "in_review" | "approved";

export async function setRoomAssetStatusAction(
  assetId: string,
  status: RoomAssetStatus,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: asset } = await supabase
    .from("room_assets")
    .select("uploaded_by, room_id, file_name")
    .eq("id", assetId)
    .single();

  const { error } = await supabase
    .from("room_assets")
    .update({ status })
    .eq("id", assetId);

  if (error) return { success: false, error: "Failed to update status" };

  if (asset?.uploaded_by && (status === "in_review" || status === "approved")) {
    const { data: room } = await supabase.from("rooms").select("apartment_id").eq("id", asset.room_id).single();
    const { data: apartment } = room ? await supabase.from("apartments").select("project_id").eq("id", room.apartment_id).single() : { data: null };
    const projectId = apartment?.project_id;
    const apartmentId = room?.apartment_id;
    const link =
      projectId && apartmentId
        ? `/my-projects/${projectId}/apartments/${apartmentId}?highlight=${assetId}`
        : null;
    const assetLabel = asset.file_name || "Render";
    const title = status === "approved" ? "Render approved" : "Render in review";
    const body = status === "approved"
      ? `"${assetLabel}" has been approved.`
      : `"${assetLabel}" is now in review.`;

    await supabase.from("notifications").insert({
      user_id: asset.uploaded_by,
      type: `render_${status}`,
      title,
      body,
      link,
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
