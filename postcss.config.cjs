const cssSafelistClassArray = [
  /swal2/,
  /tippy/,
  /clear/,
  /clear-night/,
  /cloudy/,
  /cloudy-night/,
  /loading/,
  /rainy/,
  /rainy-night/,
  /snowy/,
  /snowy-night/,
  /switch/,
  /field/,
];

// Export all plugins our postcss should use
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.html', './src/js/**/*.js'],
      fontFace: true,
      safelist: cssSafelistClassArray,
    }),
  ],
};
