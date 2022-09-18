import { init } from './js/init.js';
import { initFontAwesomeIcons, hasApprovedLocationSharing } from './js/ui.js';

import './main.scss';

if (hasApprovedLocationSharing()) {
  init();
} else {
  initFontAwesomeIcons();
  document.querySelector('.btn-init-app').addEventListener('click', () => {
    init();
  });
}
