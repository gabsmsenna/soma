import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  operationId: z.string().uuid("ID da operação inválido"),
  isActive: z.boolean().optional().default(true),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  isPaid: z.boolean().optional(),
  paidAt: z.date().optional(),
  isActive: z.boolean().optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
