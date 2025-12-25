import 'dotenv/config';
import { PrismaClient } from '../../../generated/prisma/client.js';

declare global {
  var prismadb: PrismaClient | undefined;
}

// Force constructor with ANY - bypasses ALL type checks
const prisma = global.prismadb || new (PrismaClient as any)({});

if (process.env.NODE_ENV !== 'production') global.prismadb = prisma;

export default prisma;
