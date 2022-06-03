import * as schema from './schema/index.js';

export default (dbConnection) => ({
  getNfts: async (lean = true) => {
    const result = schema
        .nfts.connect(dbConnection)
        .findOne();

    return (lean) ? result.lean() : result;
  },

  setNftTransfered: async (mint, destinationWallet) => {
    const nfts = await schema
        .nfts.connect(dbConnection)
        .findOne().lean();

    nfts.hero.common[mint].transferedTo = destinationWallet;

    return schema
        .nfts.connect(dbConnection)
        .findOneAndUpdate({
          _id: nfts._id,
        }, nfts);
  },
});
