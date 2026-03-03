import { Prisma } from "@prisma/client";
import z from "zod";

const decimalTransform = z.coerce
  .number()
  .min(0, "Valor deve ser positivo")
  .optional()
  .default(0)
  .transform((val) => new Prisma.Decimal(String(val)));

export const createCreativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  totalProfit: decimalTransform,
  isActive: z.boolean().optional().default(true),
});

export const updateCreativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  totalProfit: decimalTransform,
  freelancerCut: decimalTransform,
  isPaid: z.boolean().optional(),
  paidAt: z.date().optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateCreativeDto = z.infer<typeof createCreativeSchema>;
export type UpdateCreativeDto = z.infer<typeof updateCreativeSchema>;
export type PaginationDto = z.infer<typeof paginationSchema>;
