/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */
'use client'

import { createContext, useContext } from 'react'

import type { NodeKind } from '../handle'

export interface FlowEditorContextValue {
    onAddNode?: (type: NodeKind) => void
    hasStartNode?: boolean
    /** 所有节点信息，用于在节点卡片中渲染变量标签 */
    nodes?: Array<{ id: string; data?: { label?: string } }>
}

export const FlowEditorContext = createContext<FlowEditorContextValue>({})

export function useFlowEditorContext() {
    return useContext(FlowEditorContext)
}
