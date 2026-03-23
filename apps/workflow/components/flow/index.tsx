/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */
import type { FlowEdge, FlowNode } from './editor'
import { FlowEditor } from './editor'

interface FlowProps {
    appId?: string
    appName?: string
    initialNodes?: FlowNode[]
    initialEdges?: FlowEdge[]
}

export const Flow = ({ appId = '', appName = '', initialNodes = [], initialEdges = [] }: FlowProps) => {
    return (
        <div className="h-[calc(100vh-var(--header-height))] w-full">
            {appId ? (
                <FlowEditor appId={appId} appName={appName} initialNodes={initialNodes} initialEdges={initialEdges} />
            ) : (
                <FlowEditor appId="" appName="" initialNodes={[]} initialEdges={[]} />
            )}
        </div>
    )
}
