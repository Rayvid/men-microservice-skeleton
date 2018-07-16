// Uncomment if you need Mongo connectivity check
// const log = require('../../util').logger;

module.exports = async (req, res) => {
  // Uncomment if you need Mongo connectivity check
  // try {
  //   await res.locals.getModels();
  // } catch (err) {
  //   log.error('Service unhealthy!', err);
  //   res.status(500).json({ status: 'unhealthy' });
  //   return;
  // }

  res.status(200).json({ status: 'healthy' });
};
