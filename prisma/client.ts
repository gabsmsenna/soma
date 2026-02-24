import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
};

declare global {
  // Garante que o TypeScript reconheça a variável global
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Em produção, cria uma nova instância.
// Em dev, reutiliza a instância já existente no objeto globalThis.
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
