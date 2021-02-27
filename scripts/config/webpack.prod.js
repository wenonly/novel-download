const { shouldOpenAnalyzer } = require("../constants");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const { ROOTPATH } = require("../constants");
const path = require('path')

module.exports = merge(common, {
  mode: "production",
  plugins: [
    // * 打包前清理上一次的 dist 文件夹。
    new CleanWebpackPlugin(),
    // 清除多余css样式
    new PurgeCSSPlugin({
        // * glob 是用来查找文件路径的，我们同步找到 src 下面的后缀为 .tsx 、 .(sc|c|le)ss 的文件路径并以数组形式返给 paths ，然后该插件就会去解析每一个路径对应的文件，将无用样式去除。
        paths: glob.sync(`${path.resolve(ROOTPATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
        whitelist: ['html', 'body']
    }),
    // * 打包分析器。
    shouldOpenAnalyzer &&
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        analyzerHost: "127.0.0.1",
        analyzerPort: 8888,
      }),
  ].filter(Boolean),
});
