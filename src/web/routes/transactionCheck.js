import * as exceptions from '../../exceptions/index.js';
import { Connection, PublicKey } from '@solana/web3.js';

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
        let transactions = await models.transaction.getTransaction(req.params.address);
        let result = []

        for (let i = 0; i < limit; i++) {
            if(!transactions[i]) {
                break;
            }
            result.push(transactions[i]);
        }

        res.status(200).json(result)
    } catch (err) {
        throw new exceptions.Exception({message: "transaction query failed", innerError: err});
    }
};


async function getTransactionsOfUser(walletAddress, options, connection){
    const USDCmint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const USDTmint = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

    try {
        const publicKey = new PublicKey(walletAddress);
        const transSignatures = await connection.getConfirmedSignaturesForAddress2(publicKey, options);
        const transactions = [];

        for (let i = 0; i < transSignatures.length; i++) {
            const signature = transSignatures[i].signature;
            const confirmedTransaction = await connection.getConfirmedTransaction(signature);

            if(!confirmedTransaction) {
                continue;
            }

            const { meta } = confirmedTransaction;

            if (!meta){
                continue;
            }
            
            let solChange = 0;
            let usdcChange = 0;
            let usdtChange = 0;

            if (meta.postTokenBalances.length === 0){
                const oldBalance = meta.preBalances;
                const newBalance = meta.postBalances;
                solChange = oldBalance[0] - newBalance[0];
            } else if (meta.preTokenBalances[0] != undefined) {
                if(meta.preTokenBalances[0].mint === USDCmint) {
                    usdcChange = meta.preTokenBalances[0].uiTokenAmount.uiAmount - meta.postTokenBalances[0].uiTokenAmount.uiAmount;
                }
                if(meta.preTokenBalances[0].mint === USDTmint) {
                    usdcChange = meta.preTokenBalances[0].uiTokenAmount.uiAmount - meta.postTokenBalances[0].uiTokenAmount.uiAmount;
                }
            }

            const transWithSignature = {
                signature,
                walletAddress,
                authority: "",
                blockTime: confirmedTransaction.blockTime,
                solChange,
                usdcChange,
                usdtChange
                };
                transactions.push(transWithSignature);
        }

        return transactions;

    } catch (err) {
        throw (err);
    }
};
