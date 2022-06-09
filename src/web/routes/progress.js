import _ from 'underscore';

export default async (req, res) => {
  const models = await res.locals.getModels();
  const nfts = await models.nfts.getNfts();

  res.status(200).json({
    'phase': 1,
    'total': {
      'hero': {
        'common': 470,
        'uncommon': 500,
        'rare': 133,
        'legendary': 33,
      },
    },
    'remaining': {
      'hero': {
        'common': (_.countBy(_.values(nfts.hero.common), nft => !nft.transferedTo)).true,
        'uncommon': 500,
        'rare': 133,
        'legendary': 33,
      },
    },
  });
};
