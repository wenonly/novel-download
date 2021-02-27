const { isDev } = require("../constants");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * js 和 jsx的loader
 */
const jsxRule = {
  test: /\.jsx?$/,
  use: ["babel-loader"],
  exclude: /node_modules/, //排除 node_modules 目录
};

const tsxRule = {
  test: /\.tsx?$/,
  use: ["babel-loader"],
  exclude: /node_modules/, //排除 node_modules 目录
};
/**
 * css 公共规则
 */
function getBaseCssRules(importLoaders = 1, modules = false) {
  return [
    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: modules,
        importLoaders,
        sourceMap: isDev,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            require("autoprefixer")({
              overrideBrowserslist: [">0.25%", "not dead"],
            }),
          ],
          sourceMap: isDev,
        },
      },
    },
  ];
}

const cssRule = {
  test: /\.css$/,
  use: getBaseCssRules(),
  exclude: /node_modules/,
};

// * 单独处理 antd 样式，避免模块化 css 文件影响。
const nodeCssRule = {
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDev
      }
    }
  ],
  exclude: /src/
}

const scssRule = {
  test: /\.(sc|sa)ss$/,
  use: [...getBaseCssRules(2), "sass-loader"],
  exclude: /\.module\.(sc|sa)ss$/,
};

const lessRule = {
  test: /\.less$/,
  use: [...getBaseCssRules(2), "less-loader"],
  exclude: /\.module\.less$/,
};

// modules
const scssModuleRule = {
  test: /\.module\.(sc|sa)ss$/,
  use: [...getBaseCssRules(2, true), "sass-loader"],
};

const lessModuleRule = {
  test: /\.module\.less$/,
  use: [...getBaseCssRules(2, true), "less-loader"],
};

/**
 * 图片文字处理
 */

const imageRule = {
  test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
  use: [
    {
      loader: "url-loader",
      options: {
        limit: 10240, //10K
        name: "[name].[contenthash:8].[ext]",
        outputPath: "assets/images",
        // esModule 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
        esModule: false,
      },
    },
  ],
  exclude: /node_modules/,
};

const textRule = {
  test: /\.(ttf|woff|woff2|eot|otf)$/,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "[name].[contenthash:8].[ext]",
        outputPath: "assets/fonts",
      },
    },
  ],
  exclude: /node_modules/,
};

// 解决html文件中引入图片的问题
const htmlRule = {
  test: /.html$/,
  use: "html-withimg-loader",
};

module.exports = {
  jsxRule,
  cssRule,
  nodeCssRule,
  scssRule,
  scssModuleRule,
  lessRule,
  lessModuleRule,
  imageRule,
  textRule,
  htmlRule,
  tsxRule,
};
