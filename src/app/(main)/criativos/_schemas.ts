import z from "zod";

export const createCreativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  totalProfit: z.number().positive("Lucro deve ser positivo"),
  operationId: z.string().min(1, "Operação é obrigatória"),
});

export const updateCreativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  totalProfit: z.number().positive("Lucro deve ser positivo").optional(),
});

export const registerProfitSchema = z.object({
  amount: z.number().positive("Valor deve ser positivo"),
});

export type CreateCreativeInput = z.infer<typeof createCreativeSchema>;
export type UpdateCreativeInput = z.infer<typeof updateCreativeSchema>;
export type RegisterProfitInput = z.infer<typeof registerProfitSchema>;
