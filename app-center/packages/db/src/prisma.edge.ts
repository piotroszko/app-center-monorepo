import { PrismaClient } from "@prisma/client";

const prismaEdgeClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaEdgeGlobal: ReturnType<typeof prismaEdgeClientSingleton>;
} & typeof global;

const prismaEdge = globalThis.prismaEdgeGlobal ?? prismaEdgeClientSingleton();

export { prismaEdge };

if (process.env.NODE_ENV !== "production")
  globalThis.prismaEdgeGlobal = prismaEdge;
