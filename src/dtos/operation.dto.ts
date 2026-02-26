import z from "zod";

export const createOperationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export type CreateOperationDto = z.infer<typeof createOperationSchema>;

export const updateOperationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export type UpdateOperationDto = z.infer<typeof updateOperationSchema>;
