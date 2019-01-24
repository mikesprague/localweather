import '../scss/styles.scss';
import { init, initOffline } from './modules/init';
import { initFontAwesomeIcons, hasApprovedLocationSharing } from './modules/ui';
import { isOnline } from './modules/defaults';

window.addEventListener('offline', () => {
  // TODO: add offline handler
  console.log('Browser offline');
  window.location.replace('/offline.html');
}, false);

window.addEventListener('online', () => {
  // TODO: add online handler
  console.log('Browser online');
  window.location.replace('/');
}, false);

document.onreadystatechange = () => {
  if (isOnline()) {
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
  } else {
    initOffline();
  }
};
