const log = require('../../util').logger;

module.exports = async (req, res) => {
  log.debug('Debug statement');
  res.json({ message: `${Object.keys(res.locals.getModels()).length} models found in Users database` });
};
