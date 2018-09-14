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

module.exports = schema;
