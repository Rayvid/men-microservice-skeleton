import {db} from '../../util/index.js';
import model from '../../model/index.js';

export default (app) => {
  // To not even initialize db where its not needed, models are lazy, populated by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = async () => {
      res.locals.getModels = async () => ({
        discount: await model.discountRepository(await db.getConnection('Discount')),
        sportsApp: await model.sportsAppRepository(await db.getConnection('SportsApp')),

        transaction: await model.transactionRepository(await db.getConnection('Transaction')),

        nfts: await model.nftsRepository(await db.getConnection('Nfts')),
      });
      return res.locals.getModels();
    };

    next();
  });
};
