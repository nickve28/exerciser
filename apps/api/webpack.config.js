/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

var APP_ENV       = process.env.APP_ENV || process.env.NODE_ENV || 'development';
var IS_PROD_BUILD = ! ["development", "test"].includes(APP_ENV);


module.exports = {
  entry: './web/static/js/app.js',
  output: { path: __dirname, filename: './priv/static/js/app.js' },
  node: {
    dns: 'mock',
    net: 'mock'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, "web/static/js"), "node_modules"]
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'es2016', 'react', 'stage-3', 'stage-0']
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

if (IS_PROD_BUILD) {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  module.exports.plugins.push(new CompressionPlugin({
			asset: "[file]",
			algorithm: "gzip",
			test: /\.(js)$/
  }));
} else {
  var exclude = /node_modules/
  module.exports.module.loaders[0].exclude = exclude
}
