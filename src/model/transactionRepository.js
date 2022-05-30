import * as schema from './schema/index.js';

export default (dbConnection) => ({
    getTransaction: async (walletAddress, lean = true) => {
        const result = schema.transaction
            .connect(dbConnection).find({ walletAddress: walletAddress });

        return (lean) ? result.lean() : result;
    },

    createTransaction: async (transaction) => {
        schema.transaction.connect(dbConnection)
        .create(transaction);
    },
})