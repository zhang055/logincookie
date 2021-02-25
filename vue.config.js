module.exports = {
    devServer: {
        // port: '8010',
        // open: true,
        proxy: {
            '/api': {
                target: 'http://172.18.100.52:8010/',
                ws:true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}