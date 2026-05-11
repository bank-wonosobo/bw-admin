import { z } from "zod";

export const organizationalStructureSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  image: z.any().optional(),
});

export type OrganizationalStructureFormInput = z.infer<
  typeof organizationalStructureSchema
>;
