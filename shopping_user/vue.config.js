module.exports = {

    publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',

    // css: {
    //     requireModuleExtension: false
    // },

    devServer: {
        port: 8090,
        proxy: {
            '/api': {
                target: 'http://192.168.0.150:8090/base_shop_project/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            // '/foo': {
            //     target: '<other_url>'
            // }
        },
        disableHostCheck: true
    },

    pluginOptions: {
        // foo: {
        //   // 插件可以作为 `options.pluginOptions.foo` 访问这些选项。
        // }
    },
}