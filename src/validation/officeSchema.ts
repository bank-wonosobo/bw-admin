import { z } from "zod";

export const officeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  // description: z.string().min(1, "Deskripsi wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
  map_link: z.string().min(1, "Link alamat wajib diisi"),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi"),
  image: z.any(),
});

export type OfficeFormInput = z.infer<typeof officeSchema>;
