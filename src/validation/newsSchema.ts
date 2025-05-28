import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  content: z.string().min(1, "Isi konten wajib diisi"),
  image: z.any(),
});

export type NewsFormInput = z.infer<typeof newsSchema>;
