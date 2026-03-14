import { z } from "zod";

export const createApartmentSchema = z.object({
  name: z.string().min(1, "Apartment name is required").max(200),
  description: z.string().max(1000).optional(),
  rooms: z.array(z.string().min(1, "Room name is required")).min(1, "At least one room is required"),
});

export const updateApartmentSchema = z.object({
  name: z.string().min(1, "Apartment name is required").max(200),
  description: z.string().max(1000).optional(),
});
