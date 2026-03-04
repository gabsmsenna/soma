import { Prisma } from "@prisma/client";
import z from "zod";

export const createOperationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  freelancerCutPercentage: z.coerce
    .number()
    .min(0, "Percentual deve ser positivo")
    .max(100, "Percentual não pode exceder 100")
    .optional()
    .default(0)
    .transform((val) => new Prisma.Decimal(String(val))),
});

export type CreateOperationDto = z.infer<typeof createOperationSchema>;

export const updateOperationSchema = z.object({
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

export type UpdateOperationDto = z.infer<typeof updateOperationSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
