import { z } from "zod";

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];
export const ALL_ACCEPTED_TYPES = [
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_DOCUMENT_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
];
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, "File too large (max 100MB)"),
  type: z.string().refine((t) => ALL_ACCEPTED_TYPES.includes(t), "Unsupported file type"),
});
