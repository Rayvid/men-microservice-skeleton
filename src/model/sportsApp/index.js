const integration = require('./integration');
const userIntegration = require('./userIntegration');

module.exports = dbConnection => ({
  getStravaIntegration: integration(dbConnection).getIntegration.bind(null, 'strava'),
  getUserStravaIntegration: userIntegration(dbConnection).getUserAppIntegration.bind(null, 'strava'),
  saveUserToken: userIntegration(dbConnection).saveOrUpdateUserIntegration,
});
