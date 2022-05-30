import * as healthCheckRoutes from './healthCheck.js';
import versionCheck from './versionCheck.js';
import {getPricesByDiscount, createDiscount} from './discount.js';

export default {
  healthCheckRoutes,
  versionCheck,
  getPricesByDiscount,
  createDiscount,
};
