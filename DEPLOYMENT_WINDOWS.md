# miao-aiflow 部署指南 (Windows 服务器)

## 服务器信息

- IP: 134.175.79.119
- 用户: Administrator
- 类型: Windows Server

## 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                     Windows Server                          │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │  Next.js       │    │  NestJS         │                 │
│  │  (端口 3000)   │    │  (端口 3100)    │                 │
│  └────────┬────────┘    └────────┬────────┘                 │
│           │                        │                          │
│           └────────┬───────────────┘                          │
│                    ▼                                          │
│           ┌─────────────────┐                                │
│           │  PostgreSQL     │                                │
│           │  (Neon 云数据库)│                                │
│           └─────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

## 部署步骤

### 步骤 1: 安装基础环境

在腾讯云控制台远程登录服务器，打开 PowerShell（管理员）执行：

```powershell
# 1. 安装 Node.js 20 LTS
winget install OpenJS.NodeJS.LTS

# 2. 安装 pnpm
npm install -g pnpm

# 3. 验证安装
node --version   # 应该显示 v20.x.x
pnpm --version
```

### 步骤 2: 准备数据库 (Neon)

1. 访问 https://neon.tech 注册账号
2. 创建新项目，获取 DATABASE_URL
3. 确保已经运行过 Prisma migrate:
    ```bash
    # 在本地执行（确保 DATABASE_URL 指向 Neon）
    pnpm prisma migrate deploy
    ```

### 步骤 3: 克隆并构建项目

```powershell
# 1. 克隆项目
cd C:\
git clone https://github.com/your-username/miaoma-aiflow.git
cd miaoma-aiflow

# 2. 安装依赖
pnpm install

# 3. 生成 Prisma Client
pnpm prisma generate

# 4. 构建项目
pnpm build
```

### 步骤 4: 配置环境变量

```powershell
# 创建 .env 文件
notepad C:\miaoma-aiflow\apps\workflow\.env

# 添加以下内容（替换为你的实际值）:
DATABASE_URL="postgresql://neon用户:neon密码@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="生成一个32位随机字符串"
NEXT_PUBLIC_APP_URL="http://134.175.79.119:3000"
RESEND_API_KEY="re_你的resend密钥"  # 可选
```

### 步骤 5: 启动服务

```powershell
# 启动 Next.js 前端 (端口 3000)
cd C:\miaoma-aiflow\apps\workflow
pnpm start

# 或者使用 PM2 管理进程（推荐）
pnpm add -g pm2
pm2 start "pnpm start" --name workflow
```

### 步骤 6: 开放防火墙端口

```powershell
# 在 PowerShell（管理员）中执行
netsh advfirewall firewall add rule name="Next.js" dir=in action=allow protocol=tcp localport=3000
```

## 验证部署

1. 打开浏览器访问: http://134.175.79.119:3000
2. 检查是否能正常加载页面

## 常见问题

### Q: 端口被占用

```powershell
# 查看端口占用
netstat -ano | findstr :3000
# 结束进程
taskkill /PID <PID> /F
```

### Q: 需要后台运行

使用 PM2:

```powershell
pnpm add -g pm2
pm2 start "pnpm start" --name workflow
pm2 logs workflow
pm2 restart workflow
```

### Q: 数据库连接问题

- 确认 Neon 的 DATABASE_URL 正确
- 确认防火墙允许 5432 端口出站

## 生产环境优化建议

1. 使用 Nginx 反向代理
2. 配置 SSL 证书（使用 Let's Encrypt）
3. 使用 PM2 进程管理
4. 设置定时备份
