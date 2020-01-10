/**
 * *每次修改完，必须重启项目
 */
const webpack = require("webpack");

/** 
  定义忽略 mini-css-extract-plugin 警告的插件.
  由于mini-css-extract-plugin在打包css时，会出现公共的css有冲突的大量warning
*/
// let devDomain = "http://mas.test.com";
let devDomain = "http://171.84.4.202/";
class CustomFilterPlugin {
  constructor({ exclude }) {
    this.exclude = exclude;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap("CustomFilterPlugin", compilation => {
      compilation.warnings = compilation.warnings.filter(
        warning => !this.exclude.test(warning.message)
      );
    });
  }
}

//===================split===============
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  lintOnSave: false,
  assetsDir: "static",
  devServer: {
    compress: true, //一切服务都启用 gzip 压缩, response header中添加Content-Encoding: gzip
    open: true, // 默认打开浏览器
    // openPage: "indexPd.html", //默认打开浏览器时的导航页面
    proxy: {
      "/api": {
        target: devDomain,
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: {
          // '^/api': ''
        }
      }
    },
    overlay: {
      warnings: true,
      errors: true
    }
  },
  configureWebpack: {
    plugins: [
      new CustomFilterPlugin({
        exclude: /Conflicting order between:/ //忽略含有“Conflicting order between”文本的警告
      }),
      //自动加载模块，而不是起别名，别名需要import，而自动加载的模块不需要import既可以使用
      new webpack.ProvidePlugin({
        _: "lodash",
        moment: "moment",
        mathjs: "mathjs",
        jquery: "jquery"
      })
    ]
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // options.compilerOptions.preserveWhitespace = true; //是否保留空白符
        return options;
      });

    //在configureWebpack中使用new webpack.DefinePlugin，不起作用，因为默认有一个，所以应该通过chainWebpack来修改默认的那个
    config.plugin("define").tap(args => {
      //args=[ { 'process.env': { NODE_ENV: '"development"', BASE_URL: '"/"' } } ]
      //切记 name:'123',其实name的值为数字123，如果要成为字符串，则name:JSON.stringify('123')
      args[0]["process.env"]["dev_domain"] = JSON.stringify(devDomain);
      return args;
    });
  }
};
