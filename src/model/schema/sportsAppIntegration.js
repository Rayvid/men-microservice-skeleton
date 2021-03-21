import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
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
{collection: 'sportsAppIntegrations'});

export const connect = (connection) => connection.model('sportsAppIntegrations', schema);
