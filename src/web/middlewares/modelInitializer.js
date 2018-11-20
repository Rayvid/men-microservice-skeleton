const db = require('../../util/db');
const model = require('../../model');

module.exports = (app) => {
  // To not even initialize db where its not needed, models are lazy, populated by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = async () => model(await db.getConnection('SportsApps'));
    res.locals.db = db;

    next();
  });
};
