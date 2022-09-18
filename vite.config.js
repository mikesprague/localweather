import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { version } from './package.json';

import * as variables from './src/js/defaults.js';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../build',
  },
  publicDir: '../public',
  base: './',
  outDir: './',
  plugins: [
    createHtmlPlugin({
      template: 'index.html',
      inject: {
        data: {
          options: {
            appName: variables.appName,
            author: variables.author,
            description: variables.description,
            keywords: variables.keywords,
            loadingText: variables.loadingText,
            themeColor: variables.themeColor,
            title: variables.title,
            versionString: variables.versionString,
          },
        },
      },
    }),
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'auto',
      registerType: 'prompt',
      filename: 'service-worker.js',
      manifestFilename: 'localweather.webmanifest',
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
      },
      includeAssets: [
        './images/weather-icon-32.png',
        './images/weather-icon-64.png',
        './images/weather-icon-128.png',
      ],
      manifest: {
        name: 'LocalWeather.io (powered by Dark Sky)',
        short_name: 'LocalWeather',
        description: 'Minimalist local weather app powered by Dark Sky',
        version,
        icons: [
          {
            src: './images/weather-icon-32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: './images/weather-icon-48.png',
            type: 'image/png',
            sizes: '48x48',
          },
          {
            src: './images/weather-icon-64.png',
            type: 'image/png',
            sizes: '64x64',
          },
          {
            src: './images/weather-icon-72.png',
            type: 'image/png',
            sizes: '72x72',
          },
          {
            src: './images/weather-icon-96.png',
            type: 'image/png',
            sizes: '96x96',
          },
          {
            src: './images/weather-icon-128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: './images/weather-icon-128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: './images/weather-icon-152.png',
            type: 'image/png',
            sizes: '152x152',
          },
          {
            src: './images/weather-icon-167.png',
            type: 'image/png',
            sizes: '167x167',
          },
          {
            src: './images/weather-icon-180.png',
            type: 'image/png',
            sizes: '180x180',
          },
          {
            src: './images/weather-icon-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        homepage_url: 'https://localweather.io/',
        lang: 'en-US',
        dir: 'auto',
        orientation: 'portrait',
        id: '/',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#133150',
        theme_color: '#133150',
      },
    }),
  ],
});
