/* eslint-disable no-console */
/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   官方出品，作者 @MiaoSong，供学员学习使用，可作练习，可用作美化简历，不可开源。
 */

import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import { join } from 'path'

// ============================================================
// 配置常量
// ============================================================

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const YEAR = new Date().getFullYear()
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * Resend API 配置 (生产环境)
 * 注册: https://resend.com
 * 免费额度: 100封/天
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_ADDRESS = process.env.SMTP_FROM_ADDRESS || 'noreply@resend.dev'

/**
 * SMTP 配置 (开发环境 - 本地测试用)
 */
const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.163.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER || '18800651722@163.com',
        pass: process.env.SMTP_PASSWORD || '',
    },
} as const

/**
 * 发件人配置
 */
const FROM_CONFIG = {
    name: 'miao AI 工作流',
    address: IS_PRODUCTION ? RESEND_FROM_ADDRESS : process.env.SMTP_FROM_ADDRESS || '18800651722@163.com',
} as const

// ============================================================
// 类型定义
// ============================================================

/**
 * 邮件发送选项
 */
export interface SendEmailOptions {
    to: string
    subject: string
    html: string
}

/**
 * 邮件模板上下文
 */
export interface TemplateContext {
    [key: string]: unknown
}

/**
 * 邮箱验证模板上下文
 */
export interface VerifyEmailContext extends TemplateContext {
    verifyUrl: string
    email: string
}

// ============================================================
// 模板管理
// ============================================================

/**
 * 模板缓存
 */
const templateCache = new Map<string, HandlebarsTemplateDelegate>()

/**
 * 加载并编译 Handlebars 模板
 */
function loadTemplate(templateName: string): HandlebarsTemplateDelegate {
    // 检查缓存
    if (templateCache.has(templateName)) {
        return templateCache.get(templateName)!
    }

    try {
        const templatePath = join(process.cwd(), 'lib', 'email', 'templates', `${templateName}.hbs`)
        const templateContent = readFileSync(templatePath, 'utf-8')
        const template = Handlebars.compile(templateContent)

        // 缓存模板
        templateCache.set(templateName, template)
        return template
    } catch (error) {
        console.error(`Failed to load template: ${templateName}`, error)
        throw new Error(`模板加载失败: ${templateName}`)
    }
}

/**
 * 渲染布局模板
 */
function renderLayout(content: string, subject: string): string {
    const layoutTemplate = loadTemplate('layout')
    return layoutTemplate({ content, subject, year: YEAR })
}

/**
 * 渲染邮件模板
 */
function renderTemplate(templateName: string, context: TemplateContext): string {
    const template = loadTemplate(templateName)
    return template(context)
}

// ============================================================
// 邮件发送器
// ============================================================

async function sendWithResend(options: SendEmailOptions): Promise<boolean> {
    if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not configured')
    }

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: `${FROM_CONFIG.name} <${FROM_CONFIG.address}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Resend API error: ${error}`)
    }

    return true
}

async function sendWithNodemailer(options: SendEmailOptions): Promise<boolean> {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport(SMTP_CONFIG)

    const info = await transporter.sendMail({
        from: `${FROM_CONFIG.name} <${FROM_CONFIG.address}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    })

    console.log('Email sent:', info.messageId)
    return true
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
        if (IS_PRODUCTION && RESEND_API_KEY) {
            return await sendWithResend(options)
        } else {
            return await sendWithNodemailer(options)
        }
    } catch (error) {
        console.error('Email send failed:', error)
        throw new Error('邮件发送失败')
    }
}

/**
 * 发送模板邮件
 */
export async function sendTemplateEmail<T extends TemplateContext>(
    to: string,
    subject: string,
    templateName: string,
    context: T
): Promise<boolean> {
    const content = renderTemplate(templateName, context)
    const html = renderLayout(content, subject)
    return sendEmail({ to, subject, html })
}

// ============================================================
// 预定义邮件类型
// ============================================================

/**
 * 生成邮箱验证邮件内容
 */
export function generateVerifyEmail(email: string, verifyToken: string): SendEmailOptions {
    const verifyUrl = `${APP_URL}/account/verify?token=${verifyToken}`

    const content = renderTemplate('verify-email', { verifyUrl, email })
    const html = renderLayout(content, '验证您的邮箱')

    return {
        to: email,
        subject: '验证您的邮箱 - miao AI 工作流',
        html,
    }
}

/**
 * 发送验证邮件
 */
export async function sendVerifyEmail(email: string, verifyToken: string): Promise<boolean> {
    const emailOptions = generateVerifyEmail(email, verifyToken)
    return sendEmail(emailOptions)
}

// ============================================================
// 工具函数
// ============================================================

/**
 * 生成验证令牌
 */
export function generateVerifyToken(): string {
    return crypto.randomUUID()
}

/**
 * 生成验证链接
 */
export function generateVerifyUrl(token: string): string {
    return `${APP_URL}/account/verify?token=${token}`
}
