import {logger as log} from '../../util/index.js';

export const getPricesByDiscount = async (req, res) => {
  const models = await res.locals.getModels();
  log.info(await models.discount.getDiscount('boo'));

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
};


export const createDiscount = async (req, res) => {
  // const models = await res.locals.getModels();

  res.status(200).json({});
};

