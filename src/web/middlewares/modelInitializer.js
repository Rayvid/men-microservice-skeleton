import {db} from '../../util/index.js';
import model from '../../model/index.js';

export default (app) => {
  // To not even initialize db where its not needed, models are lazy, populated by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = async () => {
      const discoutRepo = await model.discountRepository(await db.getConnection('Discount'));
      const sportsAppRepo = await model.sportsAppRepository(await db.getConnection('SportsApp'));
      res.locals.getModels = async () => ({
        discount: discoutRepo,
        sportsApp: sportsAppRepo,
      });
      return res.locals.getModels();
    };

    next();
  });
};
