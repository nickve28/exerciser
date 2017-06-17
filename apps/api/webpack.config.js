/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './web/static/js/app.js',
  output: { path: __dirname, filename: './priv/static/js/app.js' },
  node: {
    dns: 'mock',
    net: 'mock'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: ['css-loader'],
                }),
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
          name: "./priv/static/images/[name].[ext]"
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('./priv/static/js/app.css')
  ]
};
