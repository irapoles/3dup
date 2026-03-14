"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

export async function getSignedUploadUrl(
  bucket: string,
  path: string,
): Promise<ActionResult<{ signedUrl: string; token: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { success: false, error: "Failed to generate upload URL" };
  }

  return {
    success: true,
    data: { signedUrl: data.signedUrl, token: data.token },
  };
}

export async function deleteFile(
  bucket: string,
  path: string,
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { success: false, error: "Failed to delete file" };
  return { success: true, data: null };
}

export async function getPublicUrl(bucket: string, path: string): Promise<string> {
  const supabase = await createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
