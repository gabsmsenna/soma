import z from "zod";

export const createOperationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export type CreateOperationDto = z.infer<typeof createOperationSchema>;

export const updateOperationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
});

export type UpdateOperationDto = z.infer<typeof updateOperationSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
