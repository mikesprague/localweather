const canonical = 'https://localweather.io';
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const variables = require('./src/js/modules/defaults');

const mode = process.env.NODE_ENV;

const webpackRules = [
  {
    test: /\.(ttf|eot|woff|woff2)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
      },
    },
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /\.(js)$/,
    exclude: [/node_modules/, /lambda/],
    use: [{
      loader: 'babel-loader',
    }],
  },
];

const webpackPlugins = [
  new MiniCssExtractPlugin({
    filename: './css/styles.css',
    chunkFilename: './css/[id].css',
  }),
  new HtmlWebpackPlugin({
    inject: false,
    template: './src/index.html',
    environment: mode,
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
  new WorkboxPlugin.GenerateSW({
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    exclude: [/\._redirects$/, /\.map$/, /^manifest.*\.js(?:on)?$/],
    skipWaiting: true,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/manifest.json',
        to: './[name][ext]',
        force: true,
      },
    ],
  }),
  // new CopyWebpackPlugin({
  //   patterns: [
  //     {
  //       from: './src/*.html',
  //       to: './[name][ext]',
  //       force: true,
  //     },
  //   ],
  // }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/images/**/*',
        to: './images/[name][ext]',
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/fonts/*.woff2',
        to: './fonts/[name][ext]',
        force: true,
      },
    ],
  }),
];

if (mode === 'production') {
  webpackPlugins.push(
    new CompressionPlugin(),
  );
}

module.exports = {
  entry: [
    './src/js/app.js',
  ],
  devServer: {
    contentBase: path.join(__dirname, './'),
    open: false,
    port: 5500,
    publicPath: 'http://localhost:5500/',
    stats: 'minimal',
  },
  devtool: 'source-map',
  output: {
    filename: './js/bundle.js',
    chunkFilename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode,
  module: {
    rules: webpackRules,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: webpackPlugins,
};
