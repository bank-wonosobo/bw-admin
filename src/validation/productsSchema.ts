import { z } from "zod";

export const productsSchema = z.object({
  product_category: z.string().min(1, "Kategori produk wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  tagline: z.string().min(1, "Tagline wajib diisi"),
  image: z.any(),
});

export type ProductsFormInput = z.infer<typeof productsSchema>;
