import * as exceptions from '../../exceptions/index.js';
import { Connection, PublicKey } from '@solana/web3.js';

export const getTransactions = async (req, res) => {
    let options = { limit: 10 };

    if(req.query.limit ) {
        if (!isFinite(req.query.limit)){
            throw new exceptions.Exception({message: "limit query can only be numeric", innerError: null});
        }

        options = { limit: req.query.limit };
    }

    const network = "https://api.mainnet-beta.solana.com";
    const connection = new Connection(network);

    try {
        let transactions = await getTransactionsOfUser(req.params.address, options, connection);
        res.status(200).json(transactions)
    } catch (err) {
        throw new exceptions.Exception({message: "transaction query failed", innerError: err});
    }
    


    
};

async function getTransactionsOfUser(address, options, connection){
    const USDCmint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const USDTmint = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

    try {
    const publicKey = new PublicKey(address);
    const transSignatures =
        await connection.getConfirmedSignaturesForAddress2(publicKey, options);
    // console.log({ transSignatures });
    const transactions = [];
    for (let i = 0; i < transSignatures.length; i++) {
        const signature = transSignatures[i].signature;
        const confirmedTransaction = await connection.getConfirmedTransaction(
        signature,
        );
        if (confirmedTransaction) {
        // console.log(confirmedTransaction);
        const { meta } = confirmedTransaction;
        if (meta) {
            let solChange = 0;
            let usdcChange = 0;
            let usdtChange = 0;
            if (meta.postTokenBalances.length === 0){
            //console.log('SOL balance change')
            const oldBalance = meta.preBalances;
            const newBalance = meta.postBalances;
            solChange = oldBalance[0] - newBalance[0];
            } else {
            if(meta.preTokenBalances[0] != undefined) {
                if(meta.preTokenBalances[0].mint === USDCmint) {
                //console.log('USDC balance change');
                usdcChange = meta.preTokenBalances[0].uiTokenAmount.uiAmount - meta.postTokenBalances[0].uiTokenAmount.uiAmount;
                }
                if(meta.preTokenBalances[0].mint === USDTmint) {
                //console.log('USDT balance change');
                usdcChange = meta.preTokenBalances[0].uiTokenAmount.uiAmount - meta.postTokenBalances[0].uiTokenAmount.uiAmount;
                }
            }
            }
            const transWithSignature = {
            signature,
            blockTime: confirmedTransaction.blockTime,
            // ...confirmedTransaction,
            // fees: meta?.fee,
            solChange,
            usdcChange,
            usdtChange
            };
            transactions.push(transWithSignature);
        }
        }
    }
    return transactions;
    } catch (err) {
    throw err;
    }
};