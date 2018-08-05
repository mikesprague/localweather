const path = require('path');
const variables = require('./src/js/modules/defaults');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './src/js/app.js',
    './src/scss/styles.scss',
  ],
  output: {
    filename: './js/bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  devServer: {
    compress: true,
    port: 5500,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  mode: 'development',
  module: {
    rules: [{
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/styles.css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      environment: 'development',
      rollbarVerbose: 'true',
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
      appName: variables.appName,
      author: variables.author,
      canonical: variables.canonical,
      description: variables.description,
      keywords: variables.keywords,
      offlineHeading: variables.offlineHeading,
      offlineText: variables.offlineText,
      themeColor: variables.themeColor,
      title: variables.title,
      versionString: variables.versionString,
    }),
    new CopyWebpackPlugin([{
      from: './src/service-worker.js',
      to: './service-worker.js',
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: './src/manifest.json',
      to: './manifest.json',
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: './assets/**/*',
      to: './',
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: './now-dev.json',
      to: './now.json',
      force: true,
    }]),
  ]
};
