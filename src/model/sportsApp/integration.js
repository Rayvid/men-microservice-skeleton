const schema = require('../schema');

module.exports = dbConnection => ({
  getIntegration: async (integrationName, lean = true) => {
    const result = schema
      .sportsAppIntegrationSchema(dbConnection)
      .findOne({ provider: integrationName });

    return (lean) ? result.lean() : result;
  },
});
