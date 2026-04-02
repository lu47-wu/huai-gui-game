AI海龟汤游戏 - 技术设计文档 v2.0

1. 技术栈

前端：React 18 + TypeScript + Vite

样式：Tailwind CSS

状态管理：Zustand (轻量，适用于本项目复杂度)

路由：React Router DOM

HTTP客户端：Axios

后端/API层：Node.js + Express (部署于Vercel Serverless Functions)

AI服务：DeepSeek Chat API (性价比高，响应稳定)

部署：

前端：Vercel

后端API：Vercel Serverless Functions

2. 项目结构

src/
├── assets/                 # 静态资源
├── components/            # 通用组件
│   ├── game/
│   │   ├── GameCard.tsx   # 故事卡片
│   │   ├── ChatBubble.tsx # 单条消息气泡
│   │   ├── HintButton.tsx # “我需要提示”按钮
│   │   └── GameControls.tsx # 游戏控制按钮组
│   ├── layout/
│   │   └── Header.tsx
│   └── ui/                # 基础UI组件 (Button, Dialog等)
├── constants/             # 常量
│   └── game.ts
├── data/                  # 静态数据
│   └── stories.ts         # 故事数据
├── lib/                   # 工具库
│   ├── api/
│   │   ├── client.ts      # Axios实例
│   │   └── game.ts       # 游戏相关API函数
│   └── prompts.ts        # AI提示词模板
├── pages/                 # 页面组件
│   ├── Home.tsx          # 游戏大厅
│   ├── Game.tsx          # 游戏（推理）页
│   └── Result.tsx        # 汤底页
├── stores/               # Zustand状态库
│   └── gameStore.ts      # 游戏全局状态
├── types/                # TypeScript类型定义
│   └── index.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts

3. 数据模型

3.1 类型定义 (src/types/index.ts)

// 海龟汤故事
export interface Story {
  id: string;
  title: string;
  summary: string; // 一句话简介
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[]; // 标签，如 ['经典', '惊悚', '脑洞']
  surface: string; // 汤面
  bottom: string;  // 汤底
  logicChain: string; // 关键逻辑链描述，用于约束AI
  featuredDate?: string; // 可选，被推荐为“每日精选”的日期
}

// 对话消息
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string; // 用户问题或AI回答
  timestamp: number;
  isPivotal?: boolean; // 是否为玩家标记的关键消息
}

// 游戏状态
export interface GameState {
  currentStory: Story | null;
  messages: Message[];
  hintsUsed: number;
  isGameOver: boolean;
}

3.2 静态数据示例 (src/data/stories.ts)

import { Story } from '../types';

export const stories: Story[] = [
  {
    id: 'story-001',
    title: '消失的凶手',
    summary: '密室中的离奇死亡，凶器不翼而飞。',
    difficulty: 'medium',
    tags: ['经典', '本格'],
    surface: '侦探赶到现场时，发现一个人倒在密室中，心脏插着一把刀。门从内部反锁，窗户完好。30分钟后，警察破门而入，却发现尸体上的刀消失了。',
    bottom: '凶手是冻成冰块的刀。在温暖的室内逐渐融化，最后只剩下水渍。',
    logicChain: '1. 凶器必须是能在现场“消失”的东西。2. 刀在尸体上，但30分钟后不见了。3. 密室条件排除了被人带走。4. 因此凶器本身会状态变化（固态->液态/气态）。5. 冰刀是符合所有条件的合理解释。',
    featuredDate: '2026-03-29' // 今日精选
  }
  // ... 更多故事
];

4. 核心流程与状态管理

4.1 状态定义 (src/stores/gameStore.ts)

import { create } from 'zustand';
import { GameState, Message, Story } from '../types';

interface GameStore extends GameState {
  // Actions
  selectStory: (story: Story) => void;
  sendMessage: (content: string) => Promise<void>;
  markMessageAsPivotal: (messageId: string) => void;
  useHint: () => Promise<void>;
  revealAnswer: () => void;
  resetGame: () => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  currentStory: null,
  messages: [],
  hintsUsed: 0,
  isGameOver: false,

  selectStory: (story) => set({ currentStory: story, messages: [], hintsUsed: 0, isGameOver: false }),

  sendMessage: async (content) => {
    const { currentStory, messages } = get();
    if (!currentStory) return;

    // 1. 添加用户消息
    const userMessage: Message = { /*...*/ };
    set({ messages: [...messages, userMessage] });

    // 2. 调用AI API
    const aiResponse = await askAI(currentStory, content, messages);

    // 3. 添加AI消息
    const aiMessage: Message = { /*...*/ };
    set({ messages: [...get().messages, aiMessage] });
  },
  // ... 其他Action实现
}));

4.2 核心游戏流程

初始化：用户访问首页(Home)，加载并展示stories数据。

选择故事：用户点击GameCard，gameStore.selectStory(story)被调用，路由跳转至/game。

游戏进行：

Game页面从gameStore读取currentStory和messages并渲染。

用户输入问题 -> 触发gameStore.sendMessage(question)-> 调用后端API -> 更新状态与UI。

用户点击“标记” -> 触发gameStore.markMessageAsPivotal()。

用户点击“提示” -> 触发gameStore.useHint()。

游戏结束：用户点击“查看汤底” -> 路由跳转至/result。

真相揭晓：Result页面展示currentStory.bottom和标记过的messages。

5. AI集成设计

5.1 提示词工程 (src/lib/prompts.ts)

export const buildGamePrompt = (story: Story, conversationHistory: Message[], question: string): string => {
  return `
你是一个严格的海龟汤游戏主持人，必须基于以下信息，用最简短的格式回答。

【故事背景与规则】
1. 完整真相（汤底）：${story.bottom}
2. 玩家所见谜面（汤面）：${story.surface}
3. 关键逻辑约束：${story.logicChain}

【你的回答规则】
1. 严格基于【故事背景与规则】判断玩家问题。
2. 你的回答只能严格是以下五种之一：
   - “是”：当玩家的陈述或猜测与真相完全一致。
   - “否”：当玩家的陈述或猜测与真相直接矛盾。
   - “无关”：当无法根据真相判断，或问题与真相无关。
   - “是，但...”：当玩家猜测的主体正确，但存在次要、非矛盾的细节偏差。在“但”后仅用最简短语指出最核心的偏差。
   - “否，但...”：当玩家猜测的主体错误，但包含正确的边缘信息。在“但”后仅用最简短语指出正确的部分。
3. 绝对禁止：解释、反问、扩展叙述、透露未提及的真相。

玩家问题：${question}
你的回答：
`;
};

5.2 后端API端点 (/api/game/ask)

方法: POST

请求体:

{
  "storyId": "story-001",
  "question": "凶手是外面的人吗？",
  "history": ["Q: 人是自杀的吗？", "A: 否"] // 简化历史，可选
}

响应:

{
  "success": true,
  "data": {
    "answer": "否"
  },
  "error": null
}

后端处理逻辑：

根据storyId从数据库或文件读取完整的Story数据。

组装提示词（调用buildGamePrompt）。

调用DeepSeek API。

（关键）​ 对返回的文本进行正则匹配 const match = answer.match(/^(是|否|无关|是，但|否，但)/);，确保返回格式绝对规范。

返回格式化后的答案。

6. 关键实现说明

AI格式保障：在后端进行强制性的正则匹配与格式化，是保证游戏体验的核心安全网。

“每日精选”实现：前端在Home页面，筛选出featuredDate为当日的Story进行置顶展示。若无，可随机或默认第一个。

分享图片：使用 html2canvas库，将Result页面中指定的DOM区域渲染成图片供下载/分享。

响应式设计：利用Tailwind CSS的响应式工具类，确保在移动端与桌面端均有良好体验。

7. 开发与部署计划

Phase 1: 核心玩法：实现基础数据流、问答循环、严格的AI裁判。（MVP核心）

Phase 2: 体验打磨：实现消息标记、提示系统、汤底揭晓动画与分享。（完成MVP）

Phase 3: 部署上线：连接真实AI API，部署至Vercel，进行小范围测试。

