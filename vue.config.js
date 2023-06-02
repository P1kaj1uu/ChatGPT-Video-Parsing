const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageJson = require('./package.json')

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.fanyi.baidu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
}
