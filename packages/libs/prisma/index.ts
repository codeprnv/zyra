import { PrismaClient } from '@prisma/client/extension';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace globalThis {
    // eslint-disable-next-line no-var
    var prismadb: PrismaClient;
  }
}

const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') global.prismadb = prisma;

export default prisma;
