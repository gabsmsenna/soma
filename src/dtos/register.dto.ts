import z from "zod";

const { isValidCPF } = require("@studiovisual/brazilian-validator-js");

export const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  cpf: z
    .string()
    .transform((value) => value.replace(/\D/g, "")) // Remove tudo que não for dígito
    .refine(
      (value) => value.length === 11,
      "CPF deve conter exatamente 11 dígitos",
    )
    .refine((value) => isValidCPF(value), "CPF inválido"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
