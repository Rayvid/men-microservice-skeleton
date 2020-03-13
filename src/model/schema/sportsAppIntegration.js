const { Schema } = require('mongoose');

const schema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      unique: true, // This actually works only when mongoose autocreates DB
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
  connect: (connection) => connection.model('sportsAppIntegrations', schema),
};
