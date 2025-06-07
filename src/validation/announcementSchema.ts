import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  content: z.string().min(1, "Isi konten wajib diisi"),
  author: z.string().min(1, "Penulis wajib diisi"),
  target_audience: z.string().min(1, "Target audiens wajib diisi"),
  start_date: z.date({ required_error: "Periodes mulai wajib diisi" }),
  end_date: z.date({ required_error: "Periodes akhir wajib diisi" }),
  attachment: z.any(),
});

export type AnnouncementFormInput = z.infer<typeof announcementSchema>;
