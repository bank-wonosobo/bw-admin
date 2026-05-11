import { z } from "zod";

export const profileSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  image: z.any().optional(),
});

export type ProfileFormInput = z.infer<typeof profileSchema>;
