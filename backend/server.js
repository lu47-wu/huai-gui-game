const app = require('./index');
const cors = require('cors');

// 使用 CORS 中间件，仅允许您的 Vercel 前端访问
app.use(cors({
  origin: 'https://huai-gui-game.vercel.app' // ★ 关键：填入您的真实Vercel域名
}));

// 端口配置：优先使用云环境变量，本地开发时用 3001
const port = process.env.PORT || 3001;

// 启动服务器
app.listen(port, () => {
  console.log(`✅ 后端服务启动成功，运行在端口: ${port}`);
  console.log('GET /             --> 服务信息');
  console.log('GET /api/test     --> 测试接口');
  console.log('POST /api/chat    --> AI 对话');
  console.log('POST /api/hint    --> 获取提示');
});