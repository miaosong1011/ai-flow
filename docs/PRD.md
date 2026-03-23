# miaoAI (MiaoAI) 产品需求文档 (PRD)

## 1. 项目概述

### 1.1 产品定位

**miaoAI** 是一款可视化的工作流式AI应用构建平台，允许用户通过拖拽节点的方式构建AI工作流，无需编码即可创建和发布AI应用。

### 1.2 核心价值

- **可视化编排**: 通过拖拽节点构建AI工作流
- **多模型支持**: 支持LLM、HTTP调用、条件分支等
- **知识库集成**: 支持RAG知识库检索增强
- **一键发布**: 支持通过API密钥调用已发布应用
- **执行追踪**: 完整的执行日志和trace追踪

### 1.3 目标用户

- 非技术人员希望构建AI应用
- 小型团队快速原型验证
- 企业内部AI能力平台化

---

## 2. 功能模块

### 2.1 应用管理

| 功能        | 描述                                             |
| ----------- | ------------------------------------------------ |
| 创建应用    | 创建新的AI应用，支持工作流/聊天机器人/智能体类型 |
| 应用列表    | 查看用户所有应用，支持搜索和筛选                 |
| 应用配置    | 配置应用名称、图标、描述、标签                   |
| 应用发布    | 将应用发布为可调用版本，支持版本管理             |
| API密钥管理 | 为应用生成和管理API密钥，支持启用/禁用、过期设置 |

### 2.2 工作流编辑器

| 功能     | 描述                             |
| -------- | -------------------------------- |
| 节点面板 | 展示所有可用节点类型             |
| 画布编辑 | 拖拽节点到画布，连接节点形成流程 |
| 节点配置 | 配置每个节点的输入输出参数       |
| 变量引用 | 支持在节点中引用上下文变量       |
| 流程测试 | 在编辑器中测试运行工作流         |
| 执行历史 | 查看历史测试执行记录和详情       |

### 2.3 节点类型

| 节点类型      | 功能描述                             |
| ------------- | ------------------------------------ |
| **Start**     | 工作流起始节点，定义输入参数         |
| **LLM**       | 调用大语言模型处理文本               |
| **HTTP**      | 发起HTTP请求调用外部API              |
| **Condition** | 条件分支，根据条件选择不同执行路径   |
| **Knowledge** | 知识库检索，从向量数据库获取相关内容 |
| **End**       | 工作流结束节点，定义输出格式         |

### 2.4 知识库模块

| 功能       | 描述                                       |
| ---------- | ------------------------------------------ |
| 创建知识库 | 新建知识库，配置嵌入模型和切分参数         |
| 文档管理   | 上传和管理知识库文档，支持多种格式         |
| 文档处理   | 自动提取文本内容并进行向量切分             |
| 检索测试   | 测试知识库检索效果                         |
| 配置管理   | 配置检索模式(向量/全文/混合)、权重、topK等 |

### 2.5 API服务

| 功能          | 描述                                |
| ------------- | ----------------------------------- |
| 工作流执行API | 通过API密钥调用已发布应用           |
| 认证鉴权      | API Key方式进行身份验证             |
| 执行追踪      | 记录每次API调用的输入输出和执行详情 |

---

## 3. 核心数据模型

### 3.1 用户 (User)

```
- id: 用户ID
- email: 邮箱（唯一）
- password: 密码（加密存储）
- name: 用户名
- avatar: 头像
- emailVerified: 邮箱验证状态
- verifyToken: 验证Token
- createdAt/updatedAt: 时间戳
```

### 3.2 应用 (App)

```
- id: 应用ID
- name: 应用名称
- description: 描述
- icon: 图标
- type: 应用类型（WORKFLOW/CHATBOT/AGENT）
- tags: 标签数组
- config: 应用配置（JSON）
- version: 版本号
- isPublished: 是否已发布
- activePublishedId: 当前激活的发布版本ID
- userId: 所属用户ID
```

### 3.3 工作流 (Workflow)

```
- id: 工作流ID
- name: 工作流名称
- description: 描述
- nodes: 节点数据（JSON）
- edges: 边数据（JSON）
- version: 版本号
- appId: 关联应用ID
```

### 3.4 发布版本 (PublishedApp)

```
- id: 发布版本ID
- version: 版本号
- name/description: 发布时快照
- nodes/edges: 工作流定义快照
- appId: 关联应用ID
- publishedAt: 发布时间
- publishedBy: 发布者
```

### 3.5 API密钥 (ApiKey)

```
- id: Key ID
- name: Key名称
- key: Key值（唯一）
- keyPrefix: Key前缀（显示用）
- isActive: 是否启用
- expiresAt: 过期时间
- lastUsedAt: 最后使用时间
- usageCount: 使用次数
- appId: 关联应用ID
```

### 3.6 知识库 (KnowledgeBase)

```
- id: 知识库ID
- name: 名称
- description: 描述
- icon: 图标
- embeddingModel: 嵌入模型
- embeddingProvider: 嵌入提供商（ollama）
- dimensions: 向量维度
- chunkSize/chunkOverlap: 切分配置
- retrievalMode: 检索模式（VECTOR/FULLTEXT/HYBRID）
- vectorWeight: 向量权重
- topK: 召回数量
- threshold: 相似度阈值
- documentCount/chunkCount: 统计
- status: 状态
- userId: 所属用户ID
```

### 3.7 文档 (Document)

```
- id: 文档ID
- name: 文档名称
- originalName: 原始文件名
- mimeType: 文件类型
- size: 文件大小
- content: 提取的文本内容
- status: 处理状态
- chunkCount: 切分块数
- processedAt: 处理完成时间
- knowledgeBaseId: 所属知识库ID
```

### 3.8 执行记录

**WorkflowExecution** - 编辑器测试执行

```
- id/executionId: 执行ID
- status: 执行状态（RUNNING/SUCCESS/ERROR）
- inputs/outputs: 输入输出
- error: 错误信息
- duration: 执行耗时
- totalTokens: Token消耗
- nodeTraces: 节点执行详情
- appId: 关联应用ID
- startedAt/completedAt: 时间
```

**AppExecution** - API调用执行

```
- 同上，增加了：
- publishedAppId: 关联发布版本ID
- apiKeyId: 关联API Key ID
```

---

## 4. 用户流程

### 4.1 创建并发布应用

```
1. 用户登录系统
2. 创建新应用（选择类型、填写名称）
3. 进入工作流编辑器
4. 拖拽节点构建工作流
5. 配置每个节点的参数
6. 测试运行工作流
7. 调试并修正
8. 发布应用
9. 创建API密钥
10. 通过API调用已发布应用
```

### 4.2 构建知识库

```
1. 创建知识库（配置嵌入模型）
2. 上传文档
3. 系统自动处理：提取文本→切分→向量化→存储
4. 配置检索参数
5. 测试检索效果
6. 在工作流中使用Knowledge节点
```

---

## 5. 技术栈

| 层级     | 技术                       |
| -------- | -------------------------- |
| 前端框架 | Next.js 16 + React 19      |
| UI组件   | Radix UI + Tailwind CSS    |
| 流程图   | @xyflow/react (React Flow) |
| 后端API  | NestJS                     |
| ORM      | Prisma                     |
| 数据库   | PostgreSQL                 |
| 向量存储 | Qdrant                     |
| 嵌入模型 | Ollama (mxbai-embed-large) |
| LLM      | LangChain (支持多种LLM)    |
| 认证     | JWT + API Key              |
| 构建工具 | Turbo                      |
| 包管理   | pnpm                       |

---

## 6. 非功能性需求

### 6.1 性能

- 页面首屏加载 < 2s
- 工作流执行根据复杂度控制在合理时间内
- 知识库检索响应 < 1s

### 6.2 安全性

- 密码 bcrypt 加密存储
- API Key 唯一且支持前缀显示
- JWT token 鉴权
- 数据库字段加密存储敏感信息

### 6.3 可扩展性

- 节点可扩展（注册新节点类型）
- 工作流引擎与UI解耦
- 支持多模型接入

---

## 7. 版本历史

| 版本  | 日期    | 变更                   |
| ----- | ------- | ---------------------- |
| 1.0.0 | 2026-03 | 初始版本，包含核心功能 |

---

_文档作者: @MiaoSong_
_最后更新: 2026-03-23_
