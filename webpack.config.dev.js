const canonical = 'https://localweather.io';
const path = require('path');
const WebPackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const variables = require('./src/js/modules/defaults');

module.exports = {
  entry: [
    './src/js/app.js',
  ],
  devtool: 'source-map',
  output: {
    filename: './js/bundle.js',
    chunkFilename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.s?[ac]ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins() {
              return [autoprefixer({
                browsers: 'last 3 versions',
              })];
            },
          },
        },
      ],
    },
    {
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  node: 'current',
                },
                useBuiltIns: 'entry',
              },
            ],
          ],
        },
      }],
    }],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },
  plugins: [
    new WebPackBar(),
    new MiniCssExtractPlugin({
      filename: './css/styles.css',
      chunkFilename: './css/[id].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      environment: 'development',
      appName: variables.appName,
      author: variables.author,
      canonical,
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
      filename: 'offline.html',
      environment: 'development',
      appName: variables.appName,
      author: variables.author,
      canonical,
      description: variables.description,
      keywords: variables.keywords,
      loadingText: variables.loadingText,
      themeColor: variables.themeColor,
      title: variables.title,
      versionString: variables.versionString,
    }),
    new CopyWebpackPlugin([{
      from: './src/service-worker.js',
      to: './',
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: './src/manifest.json',
      to: './',
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: './src/_redirects',
      to: './',
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: './assets/**/*',
      to: './',
      force: true,
    }]),
  ],
};
