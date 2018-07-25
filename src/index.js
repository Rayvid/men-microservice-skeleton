
const log = require('./util').logger;
const morgan = require('morgan');
const modelInitializer = require('./model');
const bodyParser = require('body-parser');
require('./web')([
  app => app.use(morgan('combined', { stream: log.stream })),
  app => app.use(bodyParser.json()),
  modelInitializer]);
