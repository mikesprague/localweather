# LocalWeather.io
Minimalist local weather app powered by Dark Sky

![LocalWeather.io screenshots coming soon](link_to_screenshot_here)

## Features

- Progressive Web App
  - ServiceWorker used for caching assets
  - localStorage used to cache API requests in 10 minute intervals
  - App is available when offline or with intermittent connections
    - Automatically checks for new data when back online (or connection stabilizes)
  - Responsive design that scales for all device types
  - App and all assets serverd over HTTPS
  - Can add app to homescreen on mobile devices that support PWAs
  - Last [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) audit received 100 for PWA ([results](https://googlechrome.github.io/lighthouse/viewer/?gist=489395d8244be998899fea23639fc6ba))
    [![Google Lighthouse Scores](lighthouse-scores-20180819.png)](https://googlechrome.github.io/lighthouse/viewer/?gist=489395d8244be998899fea23639fc6ba)
- Geolocation from browser used for location (latitude/longitude)
  - Uses the [ask permission responsibly](https://developers.google.com/web/fundamentals/native-hardware/user-location/#ask_permission_responsibly) philosophy
    - Let's users know their location info will be used
    - Asks user to initiate process to approve access to location
    - PLANNED: Fall back to IP address geolocation service
- [Google Maps Reverse Geocoding API](https://developers.google.com/maps/documentation/geocoding/start) used to translate lat/lon to friendly name
- Weather data retrieved from [Dark Sky API](https://darksky.net/dev)
- All external API calls consolidated via barebones Node/Express API
  - Alleviates CORS issues
  - Allows for more control with rate limiting
  - Easier to abstract private API keys
  - NOTE: API source currently in private repo, planning to make public in the future
- Background color, favicon, and title are dynamic
  - Background color based on conditions and time of day
    - Clear (Day/Night)
    - Cloudy (Day/Night) - if current cloud cover over 60%
    - Rainy (Day/Night)
    - Snowy (Day/Night)
  - Favicon updates to same as curren conditions on webpage
  - Browser/Tab titlebar text updates to current temp and conditions
- Tooptips provide additional data and information about data types
  - Available via most parts of the interface
    - Hover to display on laptops/desktops
    - Tap/touch to display on mobile devices and tablets
- App automatically checks for updates (if left open)
  - Runs a task every minute, if past the 10 minute cache timeout then data is refreshed
- Uses [Bugsnag](https://bugsnag.com/) for error reporting and release tracking

### Made with

- [npm](https://www.npmjs.com/)
- [Yarn](https://yarnpkg.com/)
- [Webpack](https://webpack.js.org/)
- [Prettier](https://prettier.io/)
- [Eslint](https://eslint.org/)
- [Sass](https://sass-lang.com/)
- [Bulma](https://bulma.io/)
- [Font Aweseome Pro](https://fontawesome.com/pro/)
- [Tippy.js](https://atomiks.github.io/tippyjs/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [Bugsnag](https://www.bugsnag.com/)
- [Netlify](https://www.netlify.com/)
