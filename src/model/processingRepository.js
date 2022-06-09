import * as schema from './schema/index.js';

export default (dbConnection) => ({
  getLastBlock: async (lean = true) => {
    const result = schema
        .lastBlock.connect(dbConnection)
        .findOne();

    return (lean) ? result.lean() : result;
  },

  setLastBlock: async (lastBlock) => {
    let lastBlockRecord = await schema
        .lastBlock.connect(dbConnection)
        .findOne().lean();

    lastBlockRecord = lastBlockRecord || {};
    lastBlockRecord.lastBlock = lastBlock;

    return schema
        .lastBlock.connect(dbConnection)
        .findOneAndUpdate({
          _id: lastBlockRecord._id,
        }, lastBlockRecord, {upsert: true});
  },
});
