import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  lastBlock: {
      type: Number,
      default: 0,
  },
},
{collection: 'lastBlock'});

export const connect = (connection) => connection.model('lastBlock', schema);
