const path = require("path");

const ROOTPATH = path.resolve(__dirname, "../");
const isDev = process.env.NODE_ENV !== "production";
const devPort = 3000;
const shouldOpenAnalyzer = true;

module.exports = {
  ROOTPATH,
  isDev,
  devPort,
  shouldOpenAnalyzer,
};
