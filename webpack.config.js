const canonical = 'https://localweather.io';
const path = require('path');
const WebPackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const variables = require('./src/js/modules/defaults');

const mode = process.env.WEBPACK_SERVE ? 'development' : 'production';

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
        options: {
          sourceMap: true,
          plugins() {
            return [
              autoprefixer(),
              cssnano({ preset: 'default' }),
              purgecss({
                content: ['./src/**/*.html', './src/js/**/*.js'],
                fontFace: false,
                whitelistPatterns: [/swal2/, /tippy/, /clear/, /clear-night/, /cloudy/, /cloudy-night/, /loading/, /rainy/, /rainy-night/, /snowy/, /snowy-night/],
                whitelistPatternsChildren: [/swal2/, /tippy/],
              }),
            ];
          },
        },
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
  new WebPackBar(),
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
  new HtmlWebpackPlugin({
    inject: false,
    template: './src/offline.html',
    filename: 'offline.html',
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
    from: './src/images/**/*',
    to: './images',
    flatten: true,
    force: true,
  }]),
  new CopyWebpackPlugin([{
    from: './src/fonts/*.woff2',
    to: './fonts',
    flatten: true,
    force: true,
  }]),
];

if (mode === 'production') {
  webpackPlugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

module.exports = {
  entry: [
    './src/js/app.js',
  ],
  devServer: {
    port: 5500,
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
  plugins: webpackPlugins,
};
