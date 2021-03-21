import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: {
    type: String, // uuid
    required: true,
  },
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
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
},
{collection: 'sportsAppUserIntegrations'});

export const connect = (connection) => connection.model('sportsAppUserIntegrations', schema);
