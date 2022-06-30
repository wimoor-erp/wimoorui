// 跨域配置
module.exports = {
    devServer: {
        port: 8084,
        proxy: {
            '/api': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
                target: "http://192.168.0.129:8099", //目标地址，一般是指后台服务器地址
                changeOrigin: false, //是否跨域
                pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
                    '^/api': ""
                }
            }
        }
    }
}
