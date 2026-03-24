/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
}

export default nextConfig
