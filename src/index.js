import {logger as log} from './util/index.js';
import {Exception} from './exceptions/index.js';

process.on('uncaughtException', (err) => {
  log.error(new Exception({message: 'UNHANDLED-ERROR', innerError: err}));
  process.exit(1);
});

import './web/index.js';
