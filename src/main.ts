require('dotenv').config();

import { App } from './app';

(async () => {
  const app = await App.init();

  await app.start();
})();
