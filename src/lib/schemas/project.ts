import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  description: z.string().max(1000).optional(),
});
