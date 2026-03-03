import { Prisma } from "@prisma/client";
import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  freelancerCutPercentage: z.coerce
    .number()
    .min(0, "Percentual deve ser positivo")
    .max(100, "Percentual não pode exceder 100")
    .optional()
    .default(0)
    .transform((val) => new Prisma.Decimal(String(val))),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  freelancerCutPercentage: z.coerce
    .number()
    .min(0, "Percentual deve ser positivo")
    .max(100, "Percentual não pode exceder 100")
    .optional()
    .transform((val) =>
      val !== undefined ? new Prisma.Decimal(String(val)) : undefined,
    ),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
