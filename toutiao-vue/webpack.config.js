const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

module.exports = {

    mode: 'development',

    entry: __dirname + '/src/index.js',

    output: {
        path: __dirname + '/dist/',
        filename: 'index.js'
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', { legacy: true }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'vue-style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./template/index.html",
            hash: true,
            minify: {
                removeEmptyAttributes: true
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
            app.get('/list', function (req, res) {
                const fileName = `./mock/list_${req.query.tab}.json`;
                const backupFileName = `./mock/list.json`;
                console.log(fileName);
                fs.exists(fileName, function (exists) {
                    fs.readFile(exists ? fileName : backupFileName, function (err, content) {
                        res.send(content);
                    });
                });
            });

            app.get('/price', function (req, res) {
                res.send(JSON.stringify({
                    infos: [
                        { price: 23 * Math.random() },
                        { price: 23 * Math.random() }
                    ]
                }));
            });
        }
    }
};
