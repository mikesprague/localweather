const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/js/app.js',
    './src/scss/styles.scss',
  ],
  output: {
    filename: './dist/js/bundle.js'
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
              sourceMap: true,
            }
          }
        ]
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './dist/css/styles.css',
    }),
  ]
};
