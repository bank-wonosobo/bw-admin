import { z } from "zod";

export const complaintTypeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().optional(),
});

export type ComplaintTypeFormInput = z.infer<typeof complaintTypeSchema>;
