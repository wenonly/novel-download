# react-template

## 初始化 webpack 项目

1. 初始化 npm 项目

```shell
npm init -y
```

2. 安装 webpack 依赖

```shell
npm install webpack webpack-cli -D
```

3. 编写 webpack 配置文件

```javascript
module.exports = {
  entry: {
    app: path.resolve(ROOTPATH, 'src/index.js')
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(ROOTPATH, 'dist')
  }
};
```

4. 在 package.json 中编写 npm 命令

windows 不支持 NODE_ENV=development 的设置方式。
所以先安装 cross-env

```shell
npm install cross-env -D
```

```json
// pacakge.json
...
"scripts": {
    "build": "cross-env NODE_ENV=production webpack --config ./scripts/config/webpack.common.js"
},
...
```

5. js 转为低版本代码 `babel`

- 推荐
  [不可错过的 Babel7 知识](https://juejin.im/post/6844904008679686152)

- 安装 babel-loader

```shell
npm install babel-loader -D
```

- 还需要一些配置

```shell
npm install @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/plugin-transform-runtime -D

npm install @babel/runtime @babel/runtime-corejs3
```

- 在根目录创建 `.babelrc` 配置文件

6. 使用 HtmlWebpackPlugin 解析 html 文件

安装

```shell
npm install html-webpack-plugin -D
```

````

通过 HtmlWebpackPlugin 插件的 config 属性能够设置 html 内数据。

7. 添加本地服务器

安装

```shell
npm install webpack-dev-server -D
````

修改运行命令

```shell
"dev": "cross-env NODE_ENV=production webpack-dev-server --config ./scripts/config/webpack.dev.js",
```

使用 webpack.dev.js 保存开发配置，使用 webpack-merge 合并基础配置

8. devtool

`devtool`用于方便开发调试代码。
这里在 `webpack.dev.js` 中配置`devtool`为`cheap-module-eval-source-map`，可定位到行。
devtool 说明: [https://www.cnblogs.com/tugenhua0707/p/9464984.html](https://www.cnblogs.com/tugenhua0707/p/9464984.html)

9. 样式文件支持

安装依赖，然后配置 loader

```shell
npm install style-loader sass-loader css-loader postcss-loader autoprefixer node-sass -D
```

10. url-loader 解决图片文字引入问题

11. 每次打包前清空 dist 目录 (clean-webpack-plugin)

12. 拷贝 public 下静态文件（copy-webpack-plugin）

## ESLint

- 一些插件介绍

1. `eslint-config-airbnb`官方说明，如果要开启 React Hooks 的检查，需要在 extends 中添加一项`airbnb/hooks`；
2. `@typescript-eslint/eslint-plugin`官方说明，在 extends 中添加`plugin:@typescript-eslint/recommended`可开启针对 ts 语法推荐的规则定义；
3. `eslint-config-prettier`解决 ESLint 和 Prettier 的规范冲突；
4. `eslint-plugin-promise`书写 Promise 语法的最佳实践；
5. `eslint-plugin-unicorn`提供了很多有用的配置项，例如规范文件命名等。

- 注意事项

1. 配置`.eslintignore`文件来忽略 TS 对一些文件或文件夹的检查。

## stylelint

- 一些插件介绍

1. `stylelint-config-rational-order`用于对 CSS 属性进行排序，越懂规范的就越容易阅读；
2. `stylelint-declaration-block-no-ignored-properties`提示书写样式的矛盾，比如重复的样式，或者无效的样式；
3. `stylelint-config-prettier`解决 stylelint 和 Prettier 的规范冲突。

## 提交代码前的规范

- 一些插件介绍

1. `lint-staged`用于对 git 缓存区最新改动的代码进行格式化以及 lint 检查；
2. `husky`提供一些 git 提交代码时的钩子；
3. `@commitlint/config-conventional`规范提交注释。
4. `conventional-changelog-cli`命令生成提交记录文件。

- 注意事项

1. 插件安装完成后在`package.json`文件中进行对应的配置。

## externals

模板中使用 CDN 加载了 react 和 react-dom，在普通的项目模板中这样使用 CDN 没有问题，但是如果需要发布到`npm`以供别人使用，就不能使用这样的方式，因为当其他人执行`npm install`后这种方式会确实 react 和 react-dom 这两个依赖；**一定要注意！**

## webpack

1. `webpack-merge`合并 webpack 配置文件，方便简化 dev 和 prod 配置；
2. `cross-env`跨平台设置，使用环境变量；比如 Mac 电脑上使用`export NODE_ENV=development`，而 Windows 电脑上使用的是`set NODE_ENV=development`；安装完成之后在`package.json`文件中修改对应 scripts 即可；
3. `webpack-dev-server`在本地起一个 http 服务，通过简单的配置可指定其端口、热更新的开启等；
4. `html-webpack-plugin`将打包后的 js 文件自动引进 html 文件中；
5. `clean-webpack-plugin`打包前清理上一次的文件；
6. `css-loader`解析 .css 结尾的文件，以及`@import`等语句；
7. `style-loader`将解析后的 css 文件生成`style`标签并放到`head`标签内；
8. `node-sass` `sass-loader`解析 .scss 文件为 css 文件；
9. `postcss-flexbugs-fixes`修复和 flex 布局相关的 Bug；
10. `postcss-preset-env`将最新的 CSS 语法转换为目标环境的浏览器能够理解的 CSS 语法，开发者不用考虑浏览器兼容问题；同时使用`autoprefixer`来添加浏览器头；
11. `postcss-normalize`从 browserslist 中自动导入所需要的 normalize.css 内容；
12. `file-loader` `url-loader`处理本地资源文件，比如图片、字体等；
13. `@babel/preset-react`转译 jsx 语法；
14. `@babel/preset-typescript`编译 TS，直接去掉类型声明后用其他 babel 插件进行编译；
15. `eslint-import-resolver-typescript`引入文件使用简化路径别名的插件；
16. `@babel/preset-env`根据设置的目标浏览器环境（browserslist）找出所需的插件去转译 ES6+ 语法；
17. `@babel/plugin-transform-runtime`提供 ES 新 API 的垫片，可实现按需加载，并且不会污染原型链；
18. `@babel/runtime-corejs3`为上面的插件提供所需的垫片，该插件需要在 prod 下安装；
19. `copy-webpack-plugin`打包时把 public 文件夹下的静态资源复制到我们打包后生成的 dist 目录中；
20. `webpackbar`显示编译/打包的进度；
21. `fork-ts-checker-webpack-plugin`避免 babel 暴力编译 ts 可能会造成的 Bug；
22. `hard-source-webpack-plugin`提供了一个中间缓存，放到项目 node_modules/.cache/hard-source 下大大提高二次编译速度；
23. `mini-css-extract-plugin`css 样式拆分，抽离公共代码；
24. `purgecss-webpack-plugin`去除无用的 css 代码；
25. `node-glob`路径查找利器，帮助上面的插件找到无用 css 代码的路径；
26. `terser-webpack-plugin`webpack 内置的 JS 代码压缩工具，需要其他配置时需单独下载；
27. `optimize-css-assets-webpack-plugin`压缩 css 代码；
28. `webpack-bundle-analyzer`打包分析器；
