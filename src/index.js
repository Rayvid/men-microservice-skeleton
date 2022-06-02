import {logger as log} from './util/index.js';

process.on('uncaughtException', (err) => {
  log.error(err);
  process.exit(1);
});

import cron from './cron/index.js';
cron.searchTransactions.start();

import './web/index.js';


