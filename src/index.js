import {logger as log} from './util/index.js';

process.on('uncaughtException', (err) => {
  log.error(err);
  process.exit(1);
});

import './web/index.js';


