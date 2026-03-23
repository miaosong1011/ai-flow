/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import { NextRequest } from 'next/server'

import { apiError, apiSuccess, ErrorCode, handleApiError } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            return apiError(ErrorCode.VALIDATION_ERROR, '缺少验证令牌')
        }

        // 查找验证令牌对应的用户
        const user = await prisma.user.findUnique({
            where: { verifyToken: token },
        })

        if (!user) {
            return apiError(ErrorCode.INVALID_VERIFY_TOKEN, '验证链接无效或已过期，请确认您点击的是最新的验证邮件中的链接')
        }

        if (user.emailVerified) {
            return apiError(ErrorCode.EMAIL_ALREADY_VERIFIED, `该邮箱 ${user.email} 已经验证过了，请直接登录`)
        }

        // 更新用户验证状态
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verifyToken: null,
            },
        })

        return apiSuccess({ message: '邮箱验证成功，请登录' })
    } catch (error) {
        return handleApiError(error)
    }
}
