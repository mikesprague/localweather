import { init } from './js/init.js';
import { hasApprovedLocationSharing, initFontAwesomeIcons } from './js/ui.js';

import './index.scss';

if (hasApprovedLocationSharing()) {
  init();
} else {
  initFontAwesomeIcons();
  document.querySelector('.btn-init-app').addEventListener('click', () => {
    init();
  });
}
initFontAwesomeIcons();
