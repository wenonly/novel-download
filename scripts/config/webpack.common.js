const webpack = require("webpack");
const path = require("path");
const { ROOTPATH, isDev } = require("../constants");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { htmlConfig } = require("../config");
const Rules = require("./rules.config");
const WebpackBar = require("webpackbar");

module.exports = {
  entry: {
    app: path.resolve(ROOTPATH, "src/index.tsx"),
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(ROOTPATH, "dist"),
    publicPath: "",
  },
  resolve: {
    // * 配置后引入模块时，不需要加入后缀。
    extensions: [".tsx", ".ts", ".js", ".json"],
    // * 文件别名配置，需同步 tsconfig.json 中的映射路径配置。
    alias: {
      '@': path.resolve(ROOTPATH, "./src"),
    },
  },
  module: {
    rules: [
      Rules.tsxRule,
      Rules.jsxRule,
      Rules.cssRule,
      Rules.nodeCssRule,
      Rules.scssRule,
      Rules.scssModuleRule,
      Rules.lessRule,
      Rules.lessModuleRule,
      Rules.imageRule,
      Rules.textRule,
      // Rules.htmlRule, // html-withimg-loader处理后无法在html中使用ejs等语法
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(ROOTPATH, "public/index.html"),
      filename: "index.html",
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      config: htmlConfig[isDev ? "dev" : "build"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: path.resolve(ROOTPATH, "./public"),
          from: "*",
          to: path.resolve(ROOTPATH, "./dist"),
          toType: "dir",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    // * 控制台显示编译/打包进度。
    new WebpackBar({
      name: "build",
      color: "#fa8c16",
    }),
    !isDev &&
      // * css 样式拆分，抽离公共代码。
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css",
        ignoreOrder: false,
      }),
  ].filter(Boolean),
  // 不使用npm引入，直接通过cdn引入
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
