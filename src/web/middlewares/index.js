const log = require('../../util').logger;
const morgan = require('morgan');
const modelInitializer = require('./modelInitializer');
const bodyParser = require('body-parser');
const errorHandler = require('./error.js');

module.exports = {
  beforeHandler: [
    app => app.use(morgan('combined', { stream: log.stream })),
    app => app.use(bodyParser.json({ limit: '10mb' })),
    modelInitializer],
  errorSink: errorHandler,
};
