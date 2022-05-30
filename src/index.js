import {logger as log} from './util/index.js';

process.on('uncaughtException', (err) => {
  log.error(err);
  process.exit(1);
});

import crons from './cron/index.js';
crons.searchTransactions.start();

import './web/index.js';


