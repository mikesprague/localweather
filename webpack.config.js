const path = require('path');
const glob = require('glob');
const variables = require('./src/js/modules/defaults');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

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
  mode: process.env.WEBPACK_SERVE ? 'production' : 'development',
  module: {
    rules: [
      {
          test: /\.s?[ac]ss$/,
          use: [
              MiniCssExtractPlugin.loader,
              { loader: 'css-loader', options: { url: false, sourceMap: true } },
              { loader: 'sass-loader', options: { sourceMap: true } }
          ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: false,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          compress: false
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },
  plugins: [
    // new CleanWebpackPlugin('dist/*.*', {}),
    new MiniCssExtractPlugin({
      filename: './css/styles.css',
    }),
    new PurgecssPlugin({
      paths: glob.sync('./src/**/*',  { nodir: true })
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
  ]
};
