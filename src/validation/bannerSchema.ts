import { z } from "zod";

export const bannerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  image: z.any(),
});

export type BannerFormInput = z.infer<typeof bannerSchema>;
