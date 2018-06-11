'use strict';

import * as cache from './cache';
import * as data from './data';
import * as ui from './ui';

export function init() {
  cache.initCache();
  data.getLocationAndPopulateAppData();
  data.initDataUpdateCheck();
  ui.initTooltips();
}
