/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import './globals.css'

import type { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
    title: 'miao AI 应用 - WebApp | ',
    description: '工作流演示应用',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="zh-CN">
            <body className="min-h-screen antialiased">
                {children}
                <Toaster position="top-center" richColors />
            </body>
        </html>
    )
}
