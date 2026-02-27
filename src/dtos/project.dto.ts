import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  freelancerCutPercentage: z.coerce
    .number()
    .min(0.1, "Porcentagem mínima é 0.1%")
    .max(100, "Porcentagem máxima é 100")
    .optional()
    .default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  freelancerCutPercentage: z.coerce
    .number()
    .min(0.1, "Porcentagem mínima é 0.1%")
    .max(100, "Porcentagem máxima é 100")
    .optional(),
  isPaid: z.boolean().optional(),
  paidAt: z.date().optional(),
  isActive: z.boolean().optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
