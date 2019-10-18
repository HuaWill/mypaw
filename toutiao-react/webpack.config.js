const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const uuid = require("node-uuid");
const ROOT_PATH = path.resolve(__dirname, './dist/static');

module.exports = {

  entry: __dirname + '/src/index.js',

  mode: "development",

  output: {
    path: __dirname + '/dist/static/js/',
    filename: 'index.js',
    publicPath: '/dist/static/js'
  },

  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties']
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "../html/index.html",
      template: "./html/index.html",
      hash: true,
      minify: {
        removeEmptyAttributes: false
      }
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: '0.0.0.0',
    port: 9000,
    disableHostCheck: true,
    before: function (app, server) {
      app.get(/\/(home|detail|login)/, function (req, res) {
        console.log('home page requested by client side');
        const fileName = `${ROOT_PATH}/html/index.html`;
        fs.readFile(fileName, 'utf-8', function (err, content) {
          content = content
            .replace('{%__INITIAL_STATE__%}', JSON.stringify({}))
            .replace("{%__APP_CONTENT__%}", '');

          res.setHeader('Content-Type', 'text/html');
          res.send(content);
        });
      });

      app.get('/list', function (req, res) {
        if (/sessionID=/.exec(req.headers.cookie)) {
          const fileName = `./mock/list_${req.query.tab}.json`;
          const backupFileName = `./mock/list.json`;
          console.log('XHR issued by client side');
          fs.exists(fileName, function (exists) {
            fs.readFile(exists ? fileName : backupFileName, 'utf8', function (err, content) {
              res.json(JSON.parse(content));
            });
          });
        } else {
          res.status('401');
          res.json({
            "error": "unAuthed"
          });
        }
      });

      app.post('/login', (req, res) => {
        let raw = "";
        let loginData = null;
        req.on('data', chunk => {
          raw += chunk;
        });
        req.on('end', () => {
          loginData = JSON.parse(raw);
          // do server auth here...
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Set-Cookie', 'sessionID=' + uuid.v4());
          res.end();
        });
      });
    }
  }
};
