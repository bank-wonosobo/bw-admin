import { z } from "zod";

export const visionMissionSchema = z.object({
  title: z.string().optional(),
  vision: z.string().min(1, "Visi wajib diisi"),
  mission: z.string().min(1, "Misi wajib diisi"),
  image: z.any().optional(),
});

export type VisionMissionFormInput = z.infer<typeof visionMissionSchema>;
