const app = require('./index');

const port = 3001;

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('GET  /           -> 服务信息');
  console.log('GET  /api/test   -> 测试');
  console.log('POST /api/chat   -> AI 对话');
  console.log('POST /api/hint   -> 获取提示');
});