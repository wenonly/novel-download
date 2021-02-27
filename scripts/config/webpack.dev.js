const webpack = require('webpack');
const { devPort } = require("../constants");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: devPort, //默认是8080
    hot: true, // 热更新第一步
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
  },
  plugins: [
    // * 热更新第二步：引入插件，此时会全量更新；需要局部更新要在入口文件进一步设置。
    new webpack.HotModuleReplacementPlugin()
  ]
});
