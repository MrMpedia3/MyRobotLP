import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL não está definida");
    }

    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  return globalForPrisma.prisma;
}

// Proxy preguiçoso: o client só é instanciado no primeiro acesso de verdade,
// em runtime. Sem isso, importar este módulo durante o `next build` já exigiria
// DATABASE_URL e quebraria o build em ambientes que só têm a env em runtime.
export const prisma = new Proxy({} as PrismaClient, {
  get(_alvo, propriedade) {
    return Reflect.get(getPrismaClient(), propriedade);
  },
});
