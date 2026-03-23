/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/__tests__/**/*.test.ts'],
        exclude: ['node_modules', 'build'],
        testTimeout: 30000,
    },
})
