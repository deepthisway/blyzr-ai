import { PrismaClient } from '@/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

// global is used here to prevent creating multiple instances of PrismaClient in development mode
// because everytime next js restarts, it creates a new instance of PrismaClient
// hot reload in development mode causes the PrismaClient to be re-instantiated
const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma