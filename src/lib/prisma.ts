import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  // Use DIRECT_URL (ou DATABASE_URL) dependendo de como está o seu .env
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  // 1. Cria o pool de conexões nativo do Postgres
  const pool = new Pool({ connectionString });

  // 2. Cria o adaptador do Prisma
  const adapter = new PrismaPg(pool);

  // 3. Instancia o PrismaClient passando o adaptador (Padrão do Prisma 7)
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
