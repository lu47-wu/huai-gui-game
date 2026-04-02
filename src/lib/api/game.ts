import { Story, Message } from '../../types';
import { buildGamePrompt } from '../prompts';

export const askAI = async (question: string, story: Story, history: Message[] = []): Promise<string> => {
  try {
    // 调用后端接口（使用相对路径，通过Vite代理转发）
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        story: story
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'API request failed');
    }

    const answer = data.answer?.trim();

    if (!answer) {
      throw new Error('No answer received from AI');
    }

    return answer;
  } catch (error) {
    console.error('Error calling backend API:', error);
    // 错误处理：返回默认回答
    return '无关';
  }
};

export const requestHint = async (story: Story, history: Message[]): Promise<string> => {
  try {
    // 调用后端接口（使用相对路径，通过Vite代理转发）
    const response = await fetch('/api/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        story: story,
        history: history
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'API request failed');
    }

    const hint = data.hint?.trim();

    if (!hint) {
      throw new Error('No hint received from AI');
    }

    return hint;
  } catch (error) {
    console.error('Error requesting hint:', error);
    // 错误处理：返回默认提示
    return '注意故事中的关键细节';
  }
};