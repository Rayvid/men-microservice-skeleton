import * as exceptions from '../../exceptions/index.js';
import {logger as log} from '../../util/index.js';

export default async (req, res) => {
  if (req.query.code == 'DIS1979') {
    res.status(200).json({
      'wallets': {
        'hero': {
          'common': 'wallet_common_discount',
          'uncommon': 'wallet_uncommon_discount',
          'rare': 'wallet_rare_discount',
          'legendary': 'wallet_legendary_discount',
        },
      },
      'prices': {
        'common': 80,
        'uncommon': 160,
        'rare': 320,
        'legendary': 640,
      },
    });
  } else {
    res.status(200).json({
      'wallets': {
        'hero': {
          'common': 'wallet_common_no_discount',
          'uncommon': 'wallet_uncommon_no_discount',
          'rare': 'wallet_rare_no_discount',
          'legendary': 'wallet_legendary_no_discount',
        },
      },
      'prices': {
        'common': 100,
        'uncommon': 200,
        'rare': 400,
        'legendary': 800,
      },
    });
  }
  // eslint-disable-next-line prefer-const
  let result = {status: 'healthy'};
  const models = await res.locals.getModels();
  try {
    try {
      await models.createIntegration({provider: 'strava', connectionParams: {param1: '1', param2: '2'}});
    } catch (err) {
      // It can fail if run multiple times due uniqueness - it is fine
      log.warn(err);
    }

    result = {
      status: 'healthy',
      // eslint-disable-next-line no-underscore-dangle
      stravaId: (await models.getStravaIntegration())._id,
    };
  } catch (err) {
    throw new exceptions.Exception({message: 'Health check failed', innerError: err});
  }

  res.status(200).json(result);
};
