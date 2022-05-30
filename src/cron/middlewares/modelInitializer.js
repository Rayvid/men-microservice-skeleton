import {db} from '../../util/index.js';
import model from '../../model/index.js';

export const getModels = {
    discount: await model.discountRepository(await db.getConnection('Discount')),
    sportsApp: await model.sportsAppRepository(await db.getConnection('SportsApp')),

    transaction: await model.transactionRepository(await db.getConnection('Transaction')),
};