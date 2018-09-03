const canonical = "https://localweather.io";
const path = require("path");
const variables = require("./src/js/modules/defaults");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BugsnagBuildReporterPlugin = require("webpack-bugsnag-plugins");

module.exports = {
  entry: [
    "./src/js/app.js",
    "./src/scss/styles.scss",
  ],
  output: {
    filename: "./js/bundle.js",
    path: path.resolve("public")
  },
  mode: "production",
  module: {
    rules: [{
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
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
    new MiniCssExtractPlugin({
      filename: "./css/styles.css",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: "./src/index.html",
      environment: "production",
      appName: variables.appName,
      author: variables.author,
      canonical: canonical,
      description: variables.description,
      keywords: variables.keywords,
      loadingText: variables.loadingText,
      themeColor: variables.themeColor,
      title: variables.title,
      versionString: variables.versionString,
    }),
    new CopyWebpackPlugin([{
      from: "./src/service-worker.js",
      to: "./service-worker.js",
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: "./src/manifest.json",
      to: "./manifest.json",
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: "./assets/**/*",
      to: "./",
      force: true,
    }]),
    new CopyWebpackPlugin([{
      from: "./src/now.json",
      to: "./now.json",
      force: true,
    }]),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new BugsnagBuildReporterPlugin({
      apiKey: "c9beb7c090034128a89c8e58f261e972",
      appVersion: variables.versionString
    }, { /* opts */ })
  ]
};
