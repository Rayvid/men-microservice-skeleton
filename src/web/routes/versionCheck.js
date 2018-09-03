const packageJson = require('../../../package.json');

const versionCheck = async (req, res) => {
  res.status(200).json({ version: packageJson.version });
};

module.exports = versionCheck;
