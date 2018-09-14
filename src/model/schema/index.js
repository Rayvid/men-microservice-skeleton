const sportsAppIntegrationSchema = require('./sportsAppIntegration');
const sportsAppUserIntegrationSchema = require('./sportsAppUserIntegration');

module.exports = {
  sportsAppIntegrationSchema,
  sportsAppUserIntegrationSchema,
  getModels: dbConnection => ({
    sportsAppIntegrationModel: () => dbConnection.model('SportsAppIntegration', sportsAppIntegrationSchema),
    sportsAppUserIntegrationModel: () => dbConnection.model('SportsAppUserIntegration', sportsAppUserIntegrationSchema),
  }),
};
