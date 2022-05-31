import {db} from '../../util/index.js';
import model from '../../model/index.js';

// separate middleware model gathere needed for crons folder as they are not dependant
// on 'app', might need a fix?
export const getModels = {
    discount: await model.discountRepository(await db.getConnection('Discount')),
    sportsApp: await model.sportsAppRepository(await db.getConnection('SportsApp')),

    transaction: await model.transactionRepository(await db.getConnection('Transaction')),
};