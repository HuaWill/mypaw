require('env2')('./.env');

const Hapi = require('hapi');
const config = require('./config');
const routesTest = require('./routes/test');
const routesShops = require('./routes/shops');
const routesOrders = require('./routes/orders');
const pluginHapiSwagger = require('./plugins/hapi-swagger');

const server = new Hapi.Server();

server.connection({
  port: config.port,
  host: config.host
});

const init = async () => {
  await server.register([
    ...pluginHapiSwagger
  ]);

  server.route([
    ...routesTest,
    ...routesShops,
    ...routesOrders
  ]);

  await server.start();
  console.log(`server is running at: ${server.info.uri}`);
}

init();
