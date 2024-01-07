const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
// 定义压缩文件类型
const fs = require("fs");
    try {
      const vue_bundler_file = path.resolve(
        __dirname,
        "node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js"
      );
      //使用同步读取文件
      const data = fs.readFileSync(vue_bundler_file, "utf8");
      //如果未添加过
      if (data.indexOf("sharedContext.$pruneCacheEntry") < 0) {
        console.log("正在修改源码文件：", vue_bundler_file);
        //先找到__v_cache变量的位置
        let index = data.indexOf("__v_cache");
        if (index >= 0) {
          // 继续找下一个大括号 }
          index = data.indexOf("}", index);
          if (index >= 0) {
            //从下一个位置开始
            index += 1;
            //然后放一个可以释放的函数
            const remove =
              "        sharedContext.$pruneCacheEntry = (key) => cache.get(key) && pruneCacheEntry(key);";
            //然后拼接
            const result =
              data.substring(0, index) +
              "\r\n" +
              remove +
              "\r\n" +
              data.substring(index);
            fs.writeFileSync(vue_bundler_file, result, "utf8");
          }
        }
      }
    } catch (er) {
      console.error(er.message);
    }
// 跨域配置
module.exports = {
    devServer: {
        port: 8084,
        proxy: {
            '/api': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
                target: "http://127.0.0.1:8099", //目标地址，一般是指后台服务器地址
                changeOrigin: false, //是否跨域
                pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
                    '^/api': ""
                }
            }
        }
    },
    productionSourceMap:false,
	transpileDependencies: true,
	configureWebpack: {
		 plugins: [
		    new CompressionPlugin({
		      algorithm: "gzip",
		    }),
		  ],
	 }
}
