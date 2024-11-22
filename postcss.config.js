import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';

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

export default {
  plugins: [
    autoprefixer,
    tailwindcss,
    cssnano({
      preset: 'default',
    }),
    purgeCSSPlugin({
      content: ['./src/**/*.html', './src/js/**/*.js'],
      fontFace: false,
      safelist: cssSafelistClassArray,
    }),
  ],
};
