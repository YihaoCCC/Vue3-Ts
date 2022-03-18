module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                cyhComponents: '@/components'
            }
        }
    },
    devServer: {
        port:8888,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    'api': ''
                }
            }
        }
    }
}