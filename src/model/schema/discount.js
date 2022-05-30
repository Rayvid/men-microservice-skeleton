import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, // This actually works only when mongoose autocreates DB
  },
  wallets: new mongoose.Schema({
    hero: {
      type: Map,
      of: String,
      required: true,
    }
  }),
  prices: {
    type: Map,
    of: String,
    required: true,
  },
},
{collection: 'discounts'});

export const connect = (connection) => connection.model('discounts', schema);
