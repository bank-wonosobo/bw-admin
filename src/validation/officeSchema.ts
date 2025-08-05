import { z } from "zod";

export const officeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  // description: z.string().min(1, "Deskripsi wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
  map_link: z.string().min(1, "Link alamat wajib diisi"),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi"),
  image: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, {
      message: "Gambar wajib diunggah",
    })
    .refine(
      (file) =>
        file instanceof File &&
        file.size <= 5 * 1024 * 1024 &&
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Gambar harus JPEG/PNG/WEBP dan maksimal 5MB",
      }
    ),
});

export const editOfficeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  // description: z.string().min(1, "Deskripsi wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
  map_link: z.string().min(1, "Link alamat wajib diisi"),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi"),
  image: z.any(),
});

export type EditOfficeFormInput = z.infer<typeof editOfficeSchema>;
export type OfficeFormInput = z.infer<typeof officeSchema>;
