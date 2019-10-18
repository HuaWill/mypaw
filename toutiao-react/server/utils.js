const React = require('react');
const path = require('path');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const hook = require('css-modules-require-hook/preset');
const App = require('../src-es5/app').default;
const { store_ssr } = require('../src-es5/store');
// const { Provider } = require('react-redux');
const { Provider } = require('../src-es5/my-react-redux');
const fs = require('fs');
const renderSSR = (storeData) => {
  const htmlStr = renderToString(
    React.createElement(
      Provider,
      {
        store: store_ssr(storeData)
      },
      React.createElement(
        StaticRouter,
        {
          location: "/home",
          context: {}
        },
        React.createElement(App)
      )
    )
  );

  return htmlStr;
}

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        reject(err);
      }
      resolve(content);
    });
  });
}

module.exports = {
  readFile,
  renderSSR
}
