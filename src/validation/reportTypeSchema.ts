import { z } from "zod";

export const reportTypeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().optional(),
});

export type ReportTypeFormInput = z.infer<typeof reportTypeSchema>;
