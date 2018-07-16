const modelInitializer = require('./model');
const bodyParser = require('body-parser');
require('./web')([app => app.use(bodyParser.json()), modelInitializer]);
