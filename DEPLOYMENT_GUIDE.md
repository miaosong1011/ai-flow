# 🌐 免费部署指南 (Vercel + Neon)

本指南将帮助你把 miao-aiflow 项目部署到互联网。

## 📋 准备工作

### 1. 注册必要账号

| 服务   | 用途       | 注册地址           |
| ------ | ---------- | ------------------ |
| GitHub | 代码托管   | https://github.com |
| Vercel | 前端部署   | https://vercel.com |
| Neon   | PostgreSQL | https://neon.tech  |
| Resend | 邮件发送   | https://resend.com |

### 2. Fork 项目到 GitHub

```bash
# 在 GitHub 上 fork 此项目
# 然后克隆你的 fork
git clone https://github.com/你的用户名/miaoma-aiflow.git
cd miaoma-aiflow
```

---

## 🚀 部署步骤

### 第一步：创建 Neon 数据库

1. 访问 https://neon.tech 注册账号
2. 创建新项目 (Project)
3. 在 Dashboard 复制连接字符串 (Connection string)
4. 连接字符串格式：
    ```
    postgresql://用户名:密码@主机名/数据库名?sslmode=require
    ```

### 第二步：创建 Resend 邮件 API

1. 访问 https://resend.com 注册账号
2. 创建 API Key (在 API Keys 页面)
3. 验证你的域名（或使用默认的 resend.dev）

### 第三步：部署到 Vercel

#### 方式 A：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
cd apps/workflow
vercel login

# 部署 (按提示设置)
vercel

# 设置生产环境
vercel --prod
```

#### 方式 B：使用 GitHub 集成

1. 将项目推送到 GitHub
2. 访问 https://vercel.com/new
3. 点击 "Import Git Repository"
4. 选择你的 GitHub 仓库
5. 配置：
    - **Root Directory**: `apps/workflow`
    - **Build Command**: `pnpm install && pnpm prisma generate && pnpm build`
    - **Environment Variables**: 添加下方环境变量

### 第四步：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名                | 值                            | 说明                                      |
| --------------------- | ----------------------------- | ----------------------------------------- |
| `DATABASE_URL`        | `postgresql://...`            | Neon 连接字符串                           |
| `JWT_SECRET`          | `随机32位字符串`              | JWT 密钥，生成：`openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `https://你的项目.vercel.app` | 你的 Vercel 域名                          |
| `RESEND_API_KEY`      | `re_xxxxxxxx`                 | Resend API Key                            |
| `SMTP_FROM_ADDRESS`   | `noreply@你的域名.com`        | 发件邮箱（可选）                          |

### 第五步：初始化数据库

部署完成后，需要初始化数据库表：

```bash
# 在本地运行（使用 Vercel 的数据库）
cd apps/workflow
DATABASE_URL="你的Neon连接字符串" npx prisma db push
```

或者在 Vercel Functions 中触发一次注册来自动创建表。

---

## 🔧 常用命令

```bash
# 本地开发
cd apps/workflow
pnpm dev

# 构建
pnpm build

# 数据库推送
npx prisma db push

# 生成 Prisma Client
npx prisma generate
```

---

## ❓ 常见问题

### Q: 部署后数据库连接失败？

A: 确保 Neon 的连接字符串包含 `?sslmode=require`，且 Vercel 环境变量配置正确。

### Q: 邮件发送失败？

A:

1. 开发环境使用 nodemailer (需要 SMTP 配置)
2. 生产环境使用 Resend API (需要 `RESEND_API_KEY`)

### Q: 如何更新代码？

A: 推送到 GitHub，Vercel 会自动重新部署。

---

## 💰 成本

| 服务   | 免费额度            | 超出费用     |
| ------ | ------------------- | ------------ |
| Vercel | 无限带宽/100GB存储  | $20/月/扩展  |
| Neon   | 0.5GB 存储/无限项目 | $varies      |
| Resend | 100封/天            | $20/月/1万封 |

**总计：0元/月** 🚀
