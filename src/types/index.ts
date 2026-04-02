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
