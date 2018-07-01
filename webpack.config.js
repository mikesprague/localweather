const path = require('path');
const variables = require('./src/js/modules/defaults');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/js/app.js',
    './src/scss/styles.scss',
  ],
  output: {
    filename: './js/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    compress: true,
    port: 5500,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      // loader: 'babel-loader',
      // query: {
      //   presets: ['es2015']
      // }
    }],
    rules: [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
              // url: false,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              minimize: true,
              sourceMap: true,
            }
          }
        ]
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/styles.css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      appName: variables.appName,
      author: variables.author,
      canonical: variables.canonical,
      description: variables.description,
      keywords: variables.keywords,
      loadingText: variables.loadingText,
      themeColor: variables.themeColor,
      title: variables.title,
      versionString: variables.versionString,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/offline.html',
      filename: './offline.html',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/manifest.json',
      filename: './manifest.json',
      appName: variables.appName,
      canonical: variables.canonical,
      description: variables.description,
      themeColor: variables.themeColor,
      title: variables.title,
    }),
    new CopyWebpackPlugin([{
      from: './src/service-worker.js',
      to: './service-worker.js',
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: './assets/**/*',
      to: './',
    }]),
  ]
};
