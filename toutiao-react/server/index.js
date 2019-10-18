const numCPUs = require('os').cpus().length;
const server = require('./server');
const cluster = require('cluster');
const express = require('express');

const app = new express();

const enableMultiCluster = false;

if (enableMultiCluster && cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  server.init(app);
  app.set('port', '9000');
  app.listen(app.get('port'));
  console.log('开启进程:', process.pid);
}