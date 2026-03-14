import { z } from "zod";

export const createFreelancerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().max(50).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  price: z.string().max(100).optional(),
});

export type CreateFreelancerInput = z.infer<typeof createFreelancerSchema>;

export const updateFreelancerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().max(50).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  price: z.string().max(100).optional(),
});

export type UpdateFreelancerInput = z.infer<typeof updateFreelancerSchema>;
