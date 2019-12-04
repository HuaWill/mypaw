module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('tests tests');
    },
    config: {
      // 添加'api'，可以将路由暴露给Swagger文档
      // 添加'tests'，对应于plugin中的tag配置
      tags: ['api', 'tests'],
      description: '测试'
    }
  }
];
