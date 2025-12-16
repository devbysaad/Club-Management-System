import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prismaClientSingleton = () => new PrismaClient()

declare const globalThis: {
  prismaGlobal?: PrismaClient
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma