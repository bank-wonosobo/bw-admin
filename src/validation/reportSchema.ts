import { z } from "zod";

export const reportSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  period_start: z.date({ required_error: "Periode mulai wajib diisi" }),
  period_end: z.date({ required_error: "Periode akhir wajib diisi" }),
  year: z.number(),
  version: z.string().min(1, "Versi wajib diisi"),
  report_type: z.string().min(1, "Jenis laporan wajib diisi"),
  file: z.any(),
});

export type ReportFormInput = z.infer<typeof reportSchema>;
