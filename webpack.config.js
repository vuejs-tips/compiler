const webpack = require.main.require('webpack')
const HtmlWebpackPlugin = require.main.require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = {
  devtool: false,
  output: {
    publicPath: '' // same path as online version
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(require('./package.json').version)
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$' // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
}
