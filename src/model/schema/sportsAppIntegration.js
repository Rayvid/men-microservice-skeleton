const { Schema } = require('mongoose');

const schema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    connectionParams: {
      type: Map,
      of: String,
      required: true,
    },
  },
  { collection: 'sportsAppIntegrations' },
);

module.exports = {
  schema,
  // TODO wrap mongoose model with our own,
  // to include more extensive logging, compatible Exceptions, etc
  getActiveSchema: connection => connection.model('SportsAppIntegration', schema),
};
