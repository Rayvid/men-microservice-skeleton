import {wallets} from '../../../config/index.js';

export const getPricesByDiscount = async (req, res) => {
  const models = await res.locals.getModels();
  const discounts = await models.discount.getDiscount(req.query.code);

  if (discounts) {
    res.status(200).json(discounts);
  } else {
    res.status(200).json({
      'wallets': {
        'hero': {
          'common': wallets.hero.common,
          'uncommon': wallets.hero.uncommon,
          'rare': wallets.hero.rare,
          'legendary': wallets.hero.legendary,
        },
      },
      'prices': {
        'common': 80,
        'uncommon': 125,
        'rare': 185,
        'legendary': 375,
      },
    });
  }
};

export const createDiscount = async (req, res) => {
  const models = await res.locals.getModels();
  const discount = await models.discount.createDiscount(req.body);

  res.status(200).json(discount);
};

