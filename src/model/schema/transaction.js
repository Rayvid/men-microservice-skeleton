import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  signature: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  authority: {
    type: String,
    default: '',
  },
  blockTime: {
    type: Number,
    required: true,
  },
  solChange: {
    type: Number,
    default: 0,
  },
  usdcChange: {
    type: Number,
    default: 0,
  },
  usdtChange: {
    type: Number,
    default: 0,
  },

},
{collection: 'transactions'});

export const connect = (connection) => connection.model('transactions', schema);
