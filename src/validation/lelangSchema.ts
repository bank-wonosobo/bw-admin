import { z } from "zod";

export const lelangSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  link: z.string().min(1, "Link wajib diisi"),
  image: z.any().optional(),
});

export type LelangFormInput = z.infer<typeof lelangSchema>;
