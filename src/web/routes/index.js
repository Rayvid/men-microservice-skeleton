import * as healthCheckRoutes from './healthCheck.js';
import versionCheck from './versionCheck.js';
import {getPricesByDiscount, createDiscount} from './discount.js';
import getProgress from './progress.js';

export default {
  healthCheckRoutes,
  versionCheck,
  getPricesByDiscount,
  createDiscount,
  getProgress,
};
