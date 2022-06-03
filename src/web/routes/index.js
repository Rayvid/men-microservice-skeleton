import * as healthCheckRoutes from './healthCheck.js';
import versionCheck from './versionCheck.js';
import {getPricesByDiscount, createDiscount} from './discount.js';
import {getTransactions} from './transactionCheck.js';

export default {
  healthCheckRoutes,
  versionCheck,
  getPricesByDiscount,
  createDiscount,
  getTransactions,
};
