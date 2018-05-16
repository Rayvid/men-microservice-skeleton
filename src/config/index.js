const api = require('./component/api');
const db = require('./component/db');
const server = require('./component/server');
const elastic = require('./component/elastic');
const logger = require('./component/logger');

module.exports = {
  api,
  db,
  server,
  elastic,
  logger,
};
