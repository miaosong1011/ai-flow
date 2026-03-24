# miao-aiflow

AI Workflow Platform - 基于 Next.js + NestJS 的 AI 工作流平台

## 项目架构

```
miao-aiflow/
├── apps/
│   ├── workflow/       # Next.js 主应用 (端口 3000)
│   ├── api-server/     # NestJS API 服务 (端口 3002)
│   └── webapp/        # Next.js Web 应用 (端口 3001)
└── packages/
    └── ai-engine/     # AI 引擎核心包
```

## 技术栈

- **前端**: Next.js 16, React 19, Tailwind CSS 4
- **后端**: NestJS, Prisma 7 (PostgreSQL 适配器)
- **数据库**: PostgreSQL (Neon) + Qdrant (向量数据库)
- **AI**: 大语言模型集成, RAG 工作流
- **工具**: pnpm, Turbo, TypeScript, ESLint

## 快速开始

### 前置要求

- Node.js 20+
- pnpm 10.0.0+
- Docker (用于本地数据库)

### 安装依赖

```bash
# 安装 pnpm (如果未安装)
npm install -g pnpm@10.0.0

# 安装项目依赖
pnpm install
```

### 启动本地数据库

```bash
# 启动 PostgreSQL 和 Qdrant
pnpm docker:start

# 停止数据库
pnpm docker:stop
```

本地服务:

- PostgreSQL: `localhost:5433`
- Qdrant: `localhost:6333`

### 环境变量

创建 `.env` 文件:

```bash
# 数据库连接 (PostgreSQL)
DATABASE_URL="postgresql://postgres:xiaoer@localhost:5433/postgres"

# Qdrant 向量数据库
QDRANT_URL="http://localhost:6333"

# 邮件服务 (Resend)
RESEND_API_KEY="re_xxxxx"

# JWT 密钥
JWT_SECRET="your-secret-key"

# Next.js 配置
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 启动开发服务器

```bash
# 启动所有应用 (turbo)
pnpm dev

# 或单独启动各个应用:
cd apps/workflow && pnpm dev      # 端口 3000
cd apps/api-server && pnpm start:dev  # 端口 3002
cd apps/webapp && pnpm dev        # 端口 3001
```

### 数据库迁移

```bash
# 生成 Prisma Client
pnpm --filter @miao-aiflow/workflow prisma generate
pnpm --filter @miao-aiflow/api-server prisma generate
pnpm --filter @miao-aiflow/webapp prisma generate

# 运行数据库迁移
pnpm --filter @miao-aiflow/workflow prisma migrate dev
pnpm --filter @miao-aiflow/api-server prisma migrate dev
pnpm --filter @miao-aiflow/webapp prisma migrate dev
```

## 构建生产版本

```bash
# 构建所有应用
pnpm build
```

## 部署

### Vercel 部署

项目已配置 Vercel 自动部署:

1. 推送代码到 GitHub
2. Vercel 自动构建并部署

**生产环境需要配置以下环境变量:**

- `DATABASE_URL` - Neon PostgreSQL 连接字符串
- `QDRANT_URL` - Qdrant 服务 URL
- `RESEND_API_KEY` - Resend 邮件 API 密钥
- `JWT_SECRET` - JWT 签名密钥
- `NEXTAUTH_SECRET` - NextAuth 密钥
- `NEXTAUTH_URL` - 生产环境 URL

### 腾讯云服务器部署

服务器信息:

- IP: 134.175.79.119
- 用户: ubuntu

```bash
# SSH 连接
sshpass -p 'Ms771114' ssh ubuntu@134.175.79.119

# 安装 Node.js 和 pnpm
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install 20
fnm use 20
npm install -g pnpm@10.0.0

# 克隆项目
git clone https://github.com/miaosong1011/ai-flow.git
cd ai-flow
pnpm install

# 启动服务
cd apps/workflow && pnpm start
```

## 可用命令

| 命令                | 描述                 |
| ------------------- | -------------------- |
| `pnpm dev`          | 启动开发服务器       |
| `pnpm build`        | 构建生产版本         |
| `pnpm docker:start` | 启动本地数据库       |
| `pnpm docker:stop`  | 停止本地数据库       |
| `pnpm lint`         | 运行 ESLint          |
| `pnpm typecheck`    | 运行 TypeScript 检查 |
| `pnpm clean`        | 清理构建缓存         |

## 开发规范

- 使用 `pnpm commit` 或 `git commit` 提交代码
- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 严格模式

## 许可证

MiaoSong
