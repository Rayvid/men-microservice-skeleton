import {db} from '../../util/index.js';
import model from '../../model/index.js';

export default (app) => {
  // To not even initialize db where its not needed, models are lazy, populated by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = async () => {
      res.locals.getModels = async () => Promise.resolve(model(await db.getConnection('SportsApps')));
      return res.locals.getModels();
    };

    next();
  });
};
