/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import { DocumentList } from '@/components/knowledge/document-list'

export default function DocumentsPage() {
    return (
        <div className="flex-1 overflow-auto p-6">
            <DocumentList />
        </div>
    )
}
