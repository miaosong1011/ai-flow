/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */
import { redirect } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function KnowledgePage({ params }: PageProps) {
    const { id } = await params
    redirect(`/knowledge/${id}/documents`)
}
