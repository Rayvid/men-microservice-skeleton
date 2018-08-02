const log = require('../../util').logger;
const morgan = require('morgan');
const modelInitializer = require('./modelInitializer');
const bodyParser = require('body-parser');
const errorHandler = require('../middlewares/error.js');

module.exports = {
  beforeHandler: [
    app => app.use(morgan('combined', { stream: log.stream })),
    app => app.use(bodyParser.json()),
    modelInitializer],
  errorSink: errorHandler,
};
