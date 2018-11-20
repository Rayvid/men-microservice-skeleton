const { Schema } = require('mongoose');

const schema = new Schema({
  userId: {
    type: String, // uuid
    required: true,
  },
  integrationId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  authPayload: {
    type: Object,
    default: null,
  },
  lastSyncTimestamp: {
    type: Number,
    default: null,
  },
}, { collection: 'sportsAppUserIntegrations' });

module.exports = connection => connection.model('SportsAppUserIntegration', schema);
