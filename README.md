# Local Weather App

Updating an old app I wrote to be somewhat more current/modernized

## Current Features and Requirements

- App uses browser for geolocation
- Powered by Dark Sky API
- Uses own API (barebones node/express app) to alleviates CORS issues
- Uses localStorage for caching (limits Dark Sky requests to every 10 minutes)
