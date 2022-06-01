import * as schema from './schema/index.js';

export default (dbConnection) => ({
    getTransaction: async (walletAddress, limitNum = 10, lean = true) => {
        const result = schema.transaction
            .connect(dbConnection).find({ walletAddress: walletAddress }).limit(limitNum);

        return (lean) ? result.lean() : result;
    },

    createTransaction: async (transaction) => {
        schema.transaction.connect(dbConnection)
        .create(transaction);
    },
})