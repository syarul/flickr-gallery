const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  entry: [
    './src/app.js'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.styl']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.styl$/,
      options: {
        stylus: {
          // use: [rupture(), koutoSwiss(), jeet(), mdiStylus()],
          compress: false
        }
      }
    }),
    new HtmlWebpackPlugin({
      title: 'index.html',
      template: './index.html'
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  devServer: {
    hot: true,
    inline: true
  },
  devtool: 'source-map'
}