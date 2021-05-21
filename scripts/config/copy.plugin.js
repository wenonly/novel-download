const fs = require('fs')
const path = require('path')

const copyFile = function (srcPath, tarPath, filter = []) {
    fs.readdir(srcPath, function (err, files) {
      if (err === null) {
        files.forEach(function (filename) {
          let filedir = path.join(srcPath,filename);
          let filterFlag = filter.some(item => filename.indexOf(item) !== -1)
          if (!filterFlag) {
            fs.stat(filedir, function (errs, stats) {
              let isFile = stats.isFile()
              if (isFile) {                                    // 复制文件
                const destPath = path.join(tarPath,filename);
                fs.copyFile(filedir, destPath, (err) =>  { })
              } else {                                        // 创建文件夹
                let tarFiledir = path.join(tarPath,filename);
                fs.mkdir(tarFiledir,(err) =>  { });
                copyFile(filedir, tarFiledir, filter)                 // 递归
              }
            })
          }
        })
      } else {
        if (err) console.error(err);
      }
    })
  }

class CopyFilePlugin {
    constructor(opts) {
        this.opts = opts;
    }
    apply(compiler) {
        const outputPath = compiler.options.output.path;
        const context = compiler.options.context;
        compiler.hooks.afterEmit.tapAsync('CopyFilePlugin', (compilation, callback) => {
            for (const item of this.opts) {
                if (item.from && fs.existsSync(path.resolve(context, item.from))) {
                    copyFile(
                        path.resolve(context, item.from),
                        path.resolve(outputPath, item.to || './'),
                        item.excludes || [],
                    )
                }
            }
            callback()
        })
    }
}

module.exports = CopyFilePlugin