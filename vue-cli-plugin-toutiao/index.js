module.exports = (api) => {
  api.registerCommand('publish', args => {
    const wpConfig = api.resolveWebpackConfig();
    console.log('webpack config:::', wpConfig);
  })
}


// to install this plugin, run: npm i <path>
// ex: npm i /Users/whua/my-git/mypaw/vue-cli-plugin-toutiao

// to use this plugin, run vue invoke <plugin-name>
// ex: vue invoke toutiao
