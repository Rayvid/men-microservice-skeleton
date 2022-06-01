import * as exceptions from '../../exceptions/index.js';

export const getTransactions = async (req, res) => {
    const models = await res.locals.getModels();
    let limit = 10

    if(req.query.last) {
        if (!isFinite(req.query.last)){
            throw new exceptions.Exception({message: "last query can only be numeric", innerError: null});
        }
        limit = parseInt(req.query.last);
    }

    try {
        const transactions = await models.transaction.getTransaction(req.params.address, limit);

        res.status(200).json(transactions)
    } catch (err) {
        throw new exceptions.Exception({message: "transaction query failed", innerError: err});
    }
};

