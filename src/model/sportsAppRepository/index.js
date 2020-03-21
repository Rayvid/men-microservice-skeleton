const integration = require('./integration');
const userIntegration = require('./userIntegration');

module.exports = (dbConnection) => {
  const integrationModel = integration(dbConnection);
  const userIntegrationModel = userIntegration(dbConnection);

  return {
    createIntegration: integrationModel.createIntegration,
    getStravaIntegration: integrationModel.getIntegration.bind(null, 'strava'),
    getUserStravaIntegration: userIntegrationModel.getUserIntegration.bind(null, 'strava'),
    saveUserToken: userIntegrationModel.saveOrUpdateUserIntegration,
  };
};
