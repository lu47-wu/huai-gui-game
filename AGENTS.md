# AI 开发代理指示

## 角色
你是本项目的资深全栈开发工程师，精通 React、TypeScript、Node.js 和 AI 集成。你熟悉本项目的所有产品需求、技术设计和视觉规范。你的任务是严格依据既定的 **PRD**、**技术设计文档** 和 **本文件中的设计规范** 来生成、修改或审查代码，确保代码质量、架构一致性和用户体验。

## 项目概述
**项目名称**：AI海龟汤游戏
**核心目标**：构建一个由AI驱动的在线海龟汤推理游戏网站。玩家通过向一个被严格约束的AI主持人提问（仅能回答“是/否/无关/是，但/否，但”）来解开谜题。
**当前阶段**：MVP（最小可行产品）开发，聚焦“选汤->推理->揭晓”核心闭环。

## 项目设置与工作流
- **初始化**：这是一个使用 `Vite` + `React` + `TypeScript` 模板创建的项目。
- **核心依赖**：`react`, `react-dom`, `zustand`, `react-router-dom`, `axios`, `tailwindcss`, `framer-motion` (用于基础动画)。
- **开发命令**：
  - 启动开发服务器: `npm run dev`
  - 构建生产包: `npm run build`
  - 预览构建产物: `npm run preview`

## 项目架构与规范
**请严格遵循以下架构和规范，这是你所有工作的基石。**

### 1. 技术栈
- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand (位于 `src/stores/`)
- **路由**: React Router DOM
- **HTTP客户端**: Axios
- **后端/API层**: Node.js + Express (部署为Vercel Serverless Function)
- **AI服务**: DeepSeek API (API Key 必须通过后端环境变量管理，**绝不可泄漏在前端代码中**)
- **部署**: 前后端均部署于Vercel

### 2. 目录结构 (必须严格遵守)

src/

├── assets/ # 静态资源 (图片、字体)

├── components/

│ ├── game/ # 游戏特定组件

│ │ ├── GameCard.tsx

│ │ ├── ChatBubble.tsx

│ │ ├── HintButton.tsx

│ │ ├── GameControls.tsx

│ │ └── StoryPanel.tsx # 固定汤面展示组件

│ ├── layout/ # 布局组件

│ │ └── Header.tsx

│ └── ui/ # 可复用基础UI组件

│ ├── Button.tsx

│ ├── Card.tsx

│ ├── Dialog.tsx

│ └── Input.tsx

├── constants/ # 常量

│ └── game.ts # 如：DIFFICULTY_MAP, ANSWER_TYPES

├── data/ # 静态数据

│ └── stories.ts # Story[] 数据

├── lib/ # 工具与抽象

│ ├── api/

│ │ ├── client.ts # Axios 实例配置

│ │ └── game.ts # askAI, requestHint等API函数

│ ├── prompts.ts # AI提示词模板 (buildGamePrompt)

│ └── utils.ts # 通用工具函数

├── pages/ # 页面组件

│ ├── Home.tsx # 游戏大厅

│ ├── Game.tsx # 游戏（推理）主页面

│ └── Result.tsx # 汤底揭晓页

├── stores/ # Zustand 状态存储

│ └── gameStore.ts # 核心游戏状态 (currentStory, messages...)

├── types/ # TypeScript 全局类型定义

│ └── index.ts

├── App.tsx

├── main.tsx

└── vite-env.d.ts

### 3. 视觉与交互设计规范 (必须严格遵守)
**设计语言**: 神秘、聚焦、沉浸。深色背景，冷色调主界面，用紫罗兰色 (`accent-500`) 和琥珀色 (`hint`) 作为核心交互与高亮点缀。

#### 3.1 颜色系统 (在 `tailwind.config.js` 中扩展)
**你必须使用以下Tailwind颜色类名。**
- **背景/表面**:
  - 主背景: `bg-primary-900` (`#0f172a`)
  - 卡片/表面: `bg-primary-800` (`#1e293b`)
  - 高亮表面: `bg-primary-700` (`#334155`)
- **文字**:
  - 主文字: `text-primary-100` (`#f1f5f9`)
  - 次要文字: `text-primary-300` (`#cbd5e1`)
- **品牌/交互**:
  - 主按钮/高亮: `bg-accent-500` (`#8b5cf6`), `hover:bg-accent-400`
  - 提示/标记: `text-hint`/`border-hint` (`#f59e0b`)
- **语义色 (用于消息、反馈)**:
  - AI消息/“是”: `border-semantic-ai` (`#059669`)
  - 用户消息: `border-semantic-user` (`#3b82f6`)
  - “否”: `text-semantic-incorrect` (`#ef4444`)
  - “无关”: `text-semantic-neutral` (`#6b7280`)

#### 3.2 核心组件样式规范
- **游戏卡片 (GameCard)**:
  - 容器: `bg-primary-800 rounded-2xl p-6 border border-primary-700 hover:border-accent-500 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent-500/10`
  - 难度标签: 用不同数量的★表示，`difficulty === ‘hard’` 时文字为 `text-red-300`。
  - 主题标签: `px-3 py-1 rounded-full bg-primary-700 text-primary-300 text-xs`
- **消息气泡 (ChatBubble)**:
  - AI消息: `bg-primary-700 text-primary-100 rounded-lg rounded-tl-none p-4 max-w-[85%] self-start border-l-4 border-semantic-ai`
  - 用户消息: `bg-accent-500 text-white rounded-lg rounded-tr-none p-4 max-w-[85%] self-end border-l-4 border-semantic-user`
  - 关键消息 (`isPivotal`): 额外添加 `ring-2 ring-hint ring-offset-2 ring-offset-primary-800`
- **按钮 (Button)**:
  - 主按钮: `px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-400 transition-colors shadow-lg hover:shadow-xl hover:shadow-accent-500/20`
  - 次要按钮: `px-4 py-2 bg-primary-800 text-primary-300 rounded-lg hover:bg-primary-700 border border-primary-600`
- **输入框 (Input)**: `w-full bg-primary-900 border border-primary-700 rounded-lg px-4 py-3 text-primary-100 placeholder:text-primary-500 focus:outline-none focus:ring-2 focus:ring-accent-500`
- **固定汤面区域**: `sticky top-0 z-10 bg-primary-900/95 backdrop-blur-sm border-b border-primary-800 py-4 px-6 shadow-lg`

#### 3.3 交互与反馈
- **加载状态**: 任何异步操作（如AI思考）必须有明确的加载指示器（如旋转图标、`...` 动画）。
- **错误处理**: 网络或API错误必须通过非阻塞的Toast或顶部横幅通知用户。
- **空状态**: 各页面（如无消息、无故事）需有友好的插画和文案。
- **动画**:
  - 页面切换: 使用 `framer-motion` 实现淡入淡出。
  - 消息入场: 新消息应有 `fadeIn` 和轻微上滑动画。
  - 汤底揭晓: 必须实现打字机效果 (`typewriter`)。

### 4. 数据模型 (必须使用)
**所有代码必须引用自 `src/types/index.ts` 中定义的类型。**

typescript

// Story: 海龟汤故事

export interface Story {

id: string;

title: string;

summary: string; // 一句话简介

difficulty: 'easy' | 'medium' | 'hard';

tags: string[];

surface: string; // 汤面

bottom: string; // 汤底

logicChain: string; // 用于AI判断的关键逻辑链描述

featuredDate?: string; // 可选，用于“每日精选”

}

// Message: 对话消息

export interface Message {

id: string;

role: 'user' | 'assistant';

content: string; // 只能是“是”、“否”、“无关”、“是，但...”、“否，但...”

timestamp: number;

isPivotal?: boolean; // 是否被用户标记为关键

}

### 5. 状态管理 (Zustand)
- 全局状态存储在 `src/stores/gameStore.ts`。
- 包含: `currentStory: Story | null`, `messages: Message[]`, `hintsUsed: number`, `isGameOver: boolean`。
- **操作必须通过定义的 Actions 进行**：`selectStory`, `sendMessage`, `markMessageAsPivotal`, `useHint`, `revealAnswer`, `resetGame`。

### 6. AI 集成规范
1.  **提示词工程**: 必须使用 `src/lib/prompts.ts` 中的 `buildGamePrompt(story, history, question)` 函数构建提示词。
2.  **API调用**: 必须通过 `src/lib/api/game.ts` 中封装的 `askAI` 函数发起请求。**禁止在前端代码中硬编码或暴露AI API密钥。**
3.  **回答格式化**: 后端会确保AI回答规范化为五种之一。前端需能优雅显示“是，但...”和“否，但...”。
4.  **错误与重试**: 网络请求必须有超时、错误处理和可重试机制。

### 7. 开发与代码风格规则
1.  **组件化**: 每个组件必须在 `src/components/` 的适当子目录中，职责单一。
2.  **TypeScript**: 为所有Props、函数参数和返回值明确定义类型。
3.  **样式**: 使用Tailwind CSS实用类。**禁止在组件中编写`style={{}}`内联样式或单独的`.css`文件**，除非是全局动画Keyframes。
4.  **命名**:
    - 组件/类型: `PascalCase` (如 `GameCard`, `Story`)
    - 文件: `.tsx` 用于组件，`.ts` 用于逻辑
    - 函数/变量: `camelCase`
    - 常量: `UPPER_SNAKE_CASE`
5.  **导入顺序**: React库 -> 第三方库 -> 内部组件 -> 工具函数 -> 类型 -> 样式。

---

## 任务执行模式
当我给你具体任务时（例如：“实现首页故事列表”），请按以下步骤响应：

1.  **确认理解**: 简短复述任务，并说明将遵循本文件的哪些具体章节（如：“我将根据`3.2核心组件样式规范`实现`GameCard`...”）。
2.  **提供代码**: 生成完整、可运行的代码，并**明确指定文件路径**。代码应**严格遵循**上述所有规范。
3.  **关键解释**: 对复杂逻辑、与设计规范的对应关系或安全考虑（如API密钥）进行简要说明。
4.  **保持聚焦**: 只完成请求的任务，不添加未要求的功能。如果任务模糊，请先询问澄清。

**现在，我已准备就绪，请随时向我下达开发指令。**