const app = require('./index');

// 启动服务器
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ 后端服务启动成功，运行在端口: ${PORT}`);
  console.log('GET /             --> 服务信息');
  console.log('GET /api/test     --> 测试接口');
  console.log('POST /api/chat    --> AI 对话');
  console.log('POST /api/hint    --> 获取提示');
});