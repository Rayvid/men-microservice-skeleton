const schemaInitializer = require('../schema');
const integrationInitializer = require('./integration');

module.exports = (dbConnection) => {
  const models = schemaInitializer.getModels(dbConnection);
  const SportsAppUserIntegrationConstructor =
    models.sportsAppUserIntegrationModel();
  const integrationModel = integrationInitializer(dbConnection);

  return {
    getUserAppIntegration:
      async (integrationName) => {
        const integration = integrationModel.getIntegration(integrationName);

        return integration;
      },

    saveOrUpdateUserConnection:
      async ({ userId, integrationId, accessToken, expiresIn, refreshToken, authPayload }) => {
        const lastSyncTimestamp = Math.floor(new Date() / 1000);
        const sportsAppUserIntegration =
          new SportsAppUserIntegrationConstructor({
            userId,
            integrationId,
            accessToken,
            expiresIn,
            refreshToken,
            authPayload,
            lastSyncTimestamp,
          });

        sportsAppUserIntegration.validateSync();

        return sportsAppUserIntegration.findOneAndUpdate({
          userId,
          integrationId,
        }, sportsAppUserIntegration, { upsert: true });
      },
  };
};
