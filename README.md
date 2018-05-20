# Local Weather App - :construction: WIP

Minimalist local weather app powered by Dark Sky

## Current Features

- App uses browser to determine location
  - Falls back to IP address location
- Google GeoLocation API used to translate lat/lon to friendly name
- Weather data retrieved from Dark Sky API
- API calls consolidated via own API that also alleviates CORS issues
  - Barebones node/express app currently hosted on Glitch
- localStorage used for caching requests for 10 minutes
  - Makes subsequent reloads almost instant
  - Limits requests to Dark Sky API
- Background color, favicon, and title are dynamic