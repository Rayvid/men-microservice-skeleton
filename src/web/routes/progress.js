export default async (req, res) => {
  res.status(200).json({
    'phase': 1,
    'total': {
      'hero': {
        'common': 1000,
        'uncommon': 500,
        'rare': 133,
        'legendary': 33,
      },
    },
    'remaining': {
      'hero': {
        'common': 666,
        'uncommon': 200,
        'rare': 100,
        'legendary': 3,
      },
    },
  });
};
