# Modernize weather app

- [ ] jQuery -> vanilla JS/ES6
  - [ ] $ selectors
  - [ ] helper functions like $.trim()
  - [ ] ajax to fetch
- [ ] simpleWeather to DarkSky API
  - [ ] functions to get weather
  - [ ] lat/long to friendly location name
  - [ ] weather icon names
- [ ] css -> scss
  - [ ] npm scripts for scss
- [ ] update icons (latest fontawesome is svg)
- [ ] bootstrap -> css grid or flexbox
- [ ] mustache -> js template literals (maybe?)
- [x] buy domain
  - myweather.app (2 years, registered 4.23.2018)
  - localweather.app (2 years, registered 4.23.2018)

## Misc Notes

- url format w/ example for Ithaca, NY:
  - `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`
  - `https://api.darksky.net/forecast/26d527885375a09d6af95508c1b281d2/42.453017,-76.495007/?exclude=[minutely,hourly]`