import '../scss/styles.scss';
import { init } from './modules/init';
import { initFontAwesomeIcons, hasApprovedLocationSharing } from './modules/ui';

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    if (hasApprovedLocationSharing()) {
      init();
    } else {
      initFontAwesomeIcons();
      document.querySelector('.btn-init-app').addEventListener('click', () => {
        init();
      });
    }
  }
};
