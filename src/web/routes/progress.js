export default async (req, res) => {
  res.status(200).json({
    'phase': 1,
    'total': {
      'hero': {
        'common': 981,
        'uncommon': 500,
        'rare': 133,
        'legendary': 33,
      },
    },
    'remaining': {
      'hero': {
        'common': 981,
        'uncommon': 500,
        'rare': 133,
        'legendary': 33,
      },
    },
  });
};
