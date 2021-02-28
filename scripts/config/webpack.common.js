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
    popup: path.resolve(ROOTPATH, "src/popup/index.tsx"),
    options: path.resolve(ROOTPATH, "src/options/index.tsx"),
    background: path.resolve(ROOTPATH, "src/background/index.ts"),
    inject: path.resolve(ROOTPATH, "src/inject/index.ts"),
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(ROOTPATH, "dist"),
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
    ...["popup", "options"].map((name) => {
      return new HtmlWebpackPlugin({
        template: path.resolve(ROOTPATH, "public/index.html"),
        filename: `${name}.html`,
        minify: {
          removeAttributeQuotes: false, //是否删除属性的双引号
          collapseWhitespace: false, //是否折叠空白
        },
        chunks: [name],
        config: htmlConfig[isDev ? "dev" : "build"],
      })
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
    new webpack.DefinePlugin({
      'isDev': isDev
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
  // externals: {
  //   react: "React",
  //   "react-dom": "ReactDOM",
  // },
};
