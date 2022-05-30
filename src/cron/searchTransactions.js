import CronJob from 'cron';
import {wallets as walletsConfig} from '../../config/index.js';
import {getModels} from './middlewares/modelInitializer.js';

import { Connection, PublicKey } from '@solana/web3.js';

export default new CronJob.CronJob(
	'* */10 * * * *',
	main,
	null,
	false,
	'America/Los_Angeles',
);

async function main() {
    // const network = "https://api.devnet.solana.com";
    const network = "https://api.mainnet-beta.solana.com";
    const connection = new Connection(network);
    const models = getModels;

    await firstRun(models, connection);
    await addLatestTransactions(models, connection);
}

/*
finds all wallets that have to be searched and ensures that there is at least
1 entry in db with transaction from or to each wallet
*/
async function firstRun(models, connection) {
    for (let i = 0; i < walletsConfig.length; i++) {
        const savedTransactions = await models.transaction.getTransaction(walletsConfig[i]);
        
        // skip search for wallets that have at least 1 transaction already saved
        if (savedTransactions.length != 0) {
            continue;
        }

        let scrapedTransactions = await getTransactionsOfUser(walletsConfig[i], {limit: 1}, connection);
        for (let j = 0; j < scrapedTransactions.length; j++) {
            await models.transaction.createTransaction(scrapedTransactions[j]);
        }
    }
}

/*
finds all wallets that have to be searched and looks up newest transaction on
blockchain to sync them with local db
TODO: fix rate limit errors and increase search limit to more than 3
*/
async function addLatestTransactions(models, connection) {
    for (let i = 0; i < walletsConfig.length; i++) {
        const savedTransactions = await models.transaction.getTransaction(walletsConfig[i]);
        let latestBlockTime = 0;
        for (let j = 0; j < savedTransactions.length; j++) {
            if (savedTransactions[j].blockTime > latestBlockTime) {
                latestBlockTime = savedTransactions[j].blockTime;
            }
        }

        let scrapedTransactions = await getTransactionsOfUser(walletsConfig[i], {limit: 3}, connection);
        for (let j = 0; j < scrapedTransactions.length; j++) {
            if (scrapedTransactions[j].blockTime > latestBlockTime){
                await models.transaction.createTransaction(scrapedTransactions[j]);
            }
        }
    }
}


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
