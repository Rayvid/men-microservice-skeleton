import mongoose from 'mongoose';

export const schema = new mongoose.Schema({
  hero: new mongoose.Schema({
    common: {
      type: Map,
      of: Object,
      required: true,
    },
  }),
},
{collection: 'phase1'});

export const connect = (connection) => connection.model('phase1', schema);
