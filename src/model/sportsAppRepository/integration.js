const schema = require('../schema');

module.exports = (dbConnection) => ({
  getIntegration: async (integrationName, lean = true) => {
    const result = schema
      .sportsAppIntegrationSchema.connect(dbConnection)
      .findOne({ provider: integrationName });

    return (lean) ? result.lean() : result;
  },

  createIntegration: async (integration) => schema
    .sportsAppIntegrationSchema.connect(dbConnection)
    .create(integration),
});
