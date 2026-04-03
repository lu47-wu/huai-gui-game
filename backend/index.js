const express = require('express');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();

// 健康检查端点
app.get('/health', (req, res) => {
  // 不执行任何数据库、API等外部调用，立即返回成功
  res.status(200).send('OK');
});

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 解析JSON请求体
app.use(express.json());

// 根路径 - 服务信息
app.get('/', (req, res) => {
  res.json({
    message: '后端服务运行中',
    status: 'success',
    endpoints: [
      { method: 'GET', path: '/', description: '服务信息' },
      { method: 'GET', path: '/api/test', description: '测试' },
      { method: 'POST', path: '/api/chat', description: 'AI 对话' }
    ],
    timestamp: new Date().toISOString()
  });
});

// 测试接口
app.get('/api/test', (req, res) => {
  res.json({
    message: '测试接口成功',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// AI对话接口
app.post('/api/chat', async (req, res) => {
  try {
    // 验证参数
    const { question, story } = req.body;
    if (!question || !story) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要参数：question和story'
      });
    }

    // 验证API Key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        status: 'error',
        message: 'API Key未配置'
      });
    }

    // 构建提示词
    const prompt = `
你是一个严格的海龟汤游戏主持人，必须基于以下信息，用最简短的格式回答。

【故事背景与规则】
1. 完整真相（汤底）：${story.bottom}
2. 玩家所见谜面（汤面）：${story.surface}
3. 关键逻辑约束：${story.logicChain}

【你的回答规则】
1. 严格基于【故事背景与规则】判断玩家问题。
2. 你的回答只能严格是以下三种之一：
   - "是"：当玩家的陈述或猜测与真相完全一致。
   - "否"：当玩家的陈述或猜测与真相直接矛盾。
   - "无关"：当无法根据真相判断，或问题与真相无关。
3. 绝对禁止：解释、反问、扩展叙述、透露未提及的真相，以及使用"是，但..."或"否，但..."格式。
4. 必须严格按照示例格式回答，只返回"是"、"否"或"无关"。

【示例对话】
玩家：小明是不是忘记带钥匙了？
主持人：否
玩家：钥匙是不是在小明身上？
主持人：是
玩家：钥匙是不是在小明的项链上？
主持人：是

玩家问题：${question}
你的回答：
`;

    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个严格的海龟汤游戏主持人，必须基于故事背景和规则，用最简短的格式回答玩家的问题。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败：${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error('未收到AI回答');
    }

    // 验证回答格式
    const validAnswers = ['是', '否', '无关'];
    const isValidAnswer = validAnswers.includes(answer);

    if (!isValidAnswer) {
      return res.status(200).json({
        status: 'success',
        answer: '请重新提问，我只能回答"是"、"否"或"无关"'
      });
    }

    // 返回AI回答
    res.json({
      status: 'success',
      answer: answer
    });
  } catch (error) {
    console.error('AI对话错误:', error);
    res.status(500).json({
      status: 'error',
      message: 'AI对话失败，请稍后再试'
    });
  }
});

// 提示接口
app.post('/api/hint', async (req, res) => {
  try {
    // 验证参数
    const { story, history } = req.body;
    if (!story) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要参数：story'
      });
    }

    // 验证API Key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        status: 'error',
        message: 'API Key未配置'
      });
    }

    // 构建提示词
    const prompt = `
你是一个海龟汤游戏主持人，基于以下故事，为玩家提供一个不直接揭晓答案的引导性提示。

故事背景：
- 汤面：${story.surface}
- 汤底：${story.bottom}
- 关键逻辑链：${story.logicChain}

当前对话历史：
${history ? history.map(msg => `${msg.role === 'user' ? '玩家' : '主持人'}: ${msg.content}`).join('\n') : '无'}

请生成一个简短的提示，帮助玩家找到解谜的方向，但不要直接透露答案。
`;

    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个海龟汤游戏主持人，为玩家提供引导性提示。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败：${response.status}`);
    }

    const data = await response.json();
    const hint = data.choices[0]?.message?.content?.trim();

    if (!hint) {
      throw new Error('未收到提示');
    }

    // 返回提示
    res.json({
      status: 'success',
      hint: hint
    });
  } catch (error) {
    console.error('提示错误:', error);
    res.status(500).json({
      status: 'error',
      message: '获取提示失败，请稍后再试'
    });
  }
});

module.exports = app;