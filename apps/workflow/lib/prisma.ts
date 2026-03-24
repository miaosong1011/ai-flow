/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { env } from 'prisma/config'

import { PrismaClient } from '@/app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient() {
    const connectionString = env('DATABASE_URL') || 'postgresql://postgres:xiaoer@localhost:5433/postgres'

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool as any)

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
