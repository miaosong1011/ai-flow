/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import 'dotenv/config'

import { join } from 'node:path'

import { defineConfig, env } from 'prisma/config'

export default defineConfig({
    schema: join(__dirname, 'prisma', 'schema.prisma'),
    datasource: {
        url: env('DATABASE_URL'),
    },
})
