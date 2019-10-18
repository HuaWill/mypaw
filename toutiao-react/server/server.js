const path = require('path');
const utils = require('./utils');
const apiHandler = require('./api-handler');
const express = require('express');

const ROOT_DIR = '../dist/static';

const enableSSR = false;

const init = (app) => {

  app.use('/dist/static', express.static(path.resolve(__dirname, `${ROOT_DIR}`)));
  
  app.get(/^\/home/, (req, res) => {
    utils.readFile(path.resolve(__dirname, `${ROOT_DIR}/html/index.html`)).then(content => {
      let initialState = {}
      let appTpl = '';
  
      if (enableSSR) {
        apiHandler.getData().then(dataStr => {
          initialState = {
            list: apiHandler.convertData(dataStr)
          }
          appTpl = utils.renderSSR(initialState);
  
          content = content
            .replace('{%__INITIAL_STATE__%}', JSON.stringify(initialState))
            .replace("{%__APP_CONTENT__%}", appTpl);
    
          res.write(content);
          res.end();
        });
      } else {
        content = content
          .replace('{%__INITIAL_STATE__%}', JSON.stringify(initialState))
          .replace("{%__APP_CONTENT__%}", appTpl);
    
        res.write(content);
        res.end();
      }
    });
  });

  app.get(/^\/list\/?$/, (req, res) => {
    apiHandler.getData().then(dataStr => {
      const dataObj = apiHandler.convertData(dataStr);
      res.write(JSON.stringify({
        type: 'PUSH_LIST',
        data: dataObj
      }));
      res.end();
    });
  });
}

module.exports = {
  init
} 