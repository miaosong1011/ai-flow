/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */
'use client'

import { useParams } from 'next/navigation'

import { ExecutionLogList } from '@/components/execution-logs/execution-log-list'

export default function LogsPage() {
    const { id: appId } = useParams<{ id: string }>()

    return (
        <div className="flex-1 overflow-auto bg-white">
            <div className="mx-auto  p-6 pb-12">
                <ExecutionLogList appId={appId} />
            </div>
        </div>
    )
}
