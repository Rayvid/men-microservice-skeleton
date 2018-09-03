const schemaInitializer = require('../schema');

module.exports = dbConnection => ({
  getIntegration: async integrationName =>
    schemaInitializer
      .getModels(dbConnection).sportsAppIntegrationModel.findOne({ providerName: integrationName }),
});
