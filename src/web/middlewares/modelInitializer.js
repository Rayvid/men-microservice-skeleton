const db = require('../../util/db');

module.exports = (app) => {
  // To not even initialize db wheres its not needed, models are lazy, populated by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = db.getModels;
    res.locals.db = db;

    next();
  });
};
