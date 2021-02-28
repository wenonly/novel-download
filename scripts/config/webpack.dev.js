const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  watch: true,
  plugins: [
    // * 打包前清理上一次的 dist 文件夹。
    new CleanWebpackPlugin(),
  ]
});
