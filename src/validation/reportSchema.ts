import { z } from "zod";

export const reportSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  period_start: z.date({ required_error: "Tanggal mulai wajib diisi" }),
  period_end: z.date({ required_error: "Tanggal akhir wajib diisi" }),
  year: z.number(),
  version: z.string().min(1, "Versi wajib diisi"),
  report_type: z.string().min(1, "Jenis laporan wajib diisi"),
});

export type ReportFormInput = z.infer<typeof reportSchema>;
