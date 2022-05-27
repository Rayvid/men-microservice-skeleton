export const getPricesByDiscount = async (req, res) => {
  const models = await res.locals.getModels();
  const discounts = await models.discount.getDiscount('boo');

  if (discounts) {
    res.status(200).json(discounts);
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
  const models = await res.locals.getModels();
  const discount = await models.discount.createDiscount(req.body);

  res.status(200).json(discount);
};

