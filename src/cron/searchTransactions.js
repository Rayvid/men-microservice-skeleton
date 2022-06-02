import cron from 'node-cron';
import {wallets as walletsConfig} from '../../config/index.js';
import {Connection, PublicKey} from '@solana/web3.js';
import {logger as log, db} from '../util/index.js';
import model from '../model/index.js';

// cron runs every 30 seconds, check https://crontab.guru/ for more
// info on cron expressions
export default cron.schedule('*/30 * * * * *', main, {scheduled: false});


/**
 * Main function that is ran on every cron invocation
 *
 * TODO: don't start cron job if the one before it
 * hasn't finished up
 */
function main() {
  log.info('WALLETS-MONITOR: cron starting...');

  // TODO: add network in config?
  // !TODO: change network node to something that can handle the amount of requests!
  const network = 'https://api.devnet.solana.com';

  const connConfig = {httpHeaders: {'referer': 'https://edensol.net'}};
  const connection = new Connection(network, connConfig);

  db.getConnection('Transaction').then((conn) => {
    log.info('WALLETS-MONITOR: successfully connected to db');
    const repo = model.transactionRepository(conn);

    // Fire and forget
    checkHistory(repo, connection).catch((err) => log.error(err));
    addLatestTransactions(repo, connection).catch((err) => log.error(err));
  }).catch((err) => log.error(err));
}

/**
 * Ensures that each wallet to be searched has at least some of it's
 * transaction history already saved in local db
 * @param {*} transactionRepository
 * @param {*} connection
 */
async function checkHistory(transactionRepository, connection) {
  log.info('WALLETS-MONITOR: triggering check History');

  for (let i = 0; i < walletsConfig.length; i++) {
    const savedTransactions = await transactionRepository.getTransaction(walletsConfig[i]);
    // skip search for wallets that have at least 1 transaction already saved
    if (savedTransactions.length != 0) {
      continue;
    }

    const scrapedTransactions = await getTransactionsOfUser(walletsConfig[i], {limit: 50}, connection);
    for (let j = 0; j < scrapedTransactions.length; j++) {
      await transactionRepository.createTransaction(scrapedTransactions[j]);
    }
  }
}

/**
 * Search all wallet's transaction history for new transactions and add
 * them to local db if found
 * @param {*} transactionRepository
 * @param {*} connection
 */
async function addLatestTransactions(transactionRepository, connection) {
  log.info('WALLETS-MONITOR: triggering add latest transactions');

  for (let i = 0; i < walletsConfig.length; i++) {
    const savedTransactions = await transactionRepository.getTransaction(walletsConfig[i]);
    let latestBlockTime = 0;
    for (let j = 0; j < savedTransactions.length; j++) {
      if (savedTransactions[j].blockTime > latestBlockTime) {
        latestBlockTime = savedTransactions[j].blockTime;
      }
    }

    const scrapedTransactions = await getTransactionsOfUser(walletsConfig[i], {limit: 20}, connection);
    for (let j = 0; j < scrapedTransactions.length; j++) {
      if (scrapedTransactions[j].blockTime > latestBlockTime) {
        await transactionRepository.createTransaction(scrapedTransactions[j]);
      }
    }
  }
}

/**
 * Indivdual wallet transaction history scraping algo
 * @param {*} walletAddress
 * @param {*} options
 * @param {*} connection
 * @return {*}
 */
async function getTransactionsOfUser(walletAddress, options, connection) {
  const USDCmint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  const USDTmint = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

  const publicKey = new PublicKey(walletAddress);
  const transSignatures = await connection.getConfirmedSignaturesForAddress2(publicKey, options);
  const transactions = [];

  for (let i = 0; i < transSignatures.length; i++) {
    const signature = transSignatures[i].signature;
    const confirmedTransaction = await connection.getConfirmedTransaction(signature);

    if (!confirmedTransaction) {
      continue;
    }

    const {meta} = confirmedTransaction;

    if (!meta) {
      continue;
    }

    let solChange = 0;
    let usdcChange = 0;
    const usdtChange = 0;

    if (meta.postTokenBalances.length === 0) {
      const oldBalance = meta.preBalances;
      const newBalance = meta.postBalances;
      solChange = oldBalance[0] - newBalance[0];
    } else if (meta.preTokenBalances[0] != undefined) {
      if (meta.preTokenBalances[0].mint === USDCmint) {
        usdcChange = meta.preTokenBalances[0].uiTokenAmount.uiAmount - meta.postTokenBalances[0].uiTokenAmount.uiAmount;
      }
      if (meta.preTokenBalances[0].mint === USDTmint) {
        usdcChange = meta.preTokenBalances[0].uiTokenAmount.uiAmount - meta.postTokenBalances[0].uiTokenAmount.uiAmount;
      }
    }

    const transWithSignature = {
      signature,
      walletAddress,
      authority: '',
      blockTime: confirmedTransaction.blockTime,
      solChange,
      usdcChange,
      usdtChange,
    };
    transactions.push(transWithSignature);
  }

  return transactions;
};
