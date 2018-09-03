const sportsAppIntegrationSchema = require('./sportsAppIntegration');
const sportsAppUserIntegrationSchema = require('./sportsAppUserIntegration');

module.exports = {
  sportsAppIntegrationSchema,
  sportsAppUserIntegrationSchema,
  getModels: dbConnection => ({
    sportsAppIntegrationModel: sportsAppIntegrationSchema(dbConnection),
    sportsAppUserIntegrationModel: sportsAppUserIntegrationSchema(dbConnection),
  }),
};
