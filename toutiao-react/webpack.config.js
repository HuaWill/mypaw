const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

module.exports = {

    entry: __dirname + '/src/index.js',

    output: {
        path: __dirname + '/dist/',
        filename: 'index.js',
        publicPath: '/'
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
                            ['@babel/plugin-proposal-decorators', {legacy: true}],
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
            filename: "html/index.html",
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
          app.get(/\/(home|detail|aaa)/, function (req, res) {
            const fileName = `./dist/html/index.html`;
            fs.readFile(fileName, function (err, content) {
                res.setHeader('Content-Type', 'text/html');
                res.send(content);
            });
          });

          app.get('/list', function (req, res) {
            const fileName = `./mock/list_${req.query.tab}.json`;
            const backupFileName = `./mock/list.json`;
            fs.exists(fileName, function (exists) {
                fs.readFile(exists ? fileName : backupFileName, 'utf8', function (err, content) {
                  res.json(JSON.parse(content));
                });
            });
          });
        }
    }
};
