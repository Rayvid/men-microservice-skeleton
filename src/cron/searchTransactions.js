import cron from 'node-cron';
import {wallets as walletsConfig} from '../../config/index.js';
import {Connection, PublicKey} from '@solana/web3.js';
import {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token} from '@solana/spl-token';
import {logger as log, db} from '../util/index.js';
import model from '../model/index.js';
import {Exception} from '../exceptions/index.js';
import _ from 'underscore';
import axios from 'axios';

let isJobInProgress = false;

const main = () => {
  try {
    if (isJobInProgress) {
      log.info('WALLETS-MONITOR: prev job instance still in progress...');
      return;
    }
    log.info('WALLETS-MONITOR: job starting...');
    isJobInProgress = true;

    // TODO: add network in config?
    const network = 'https://holy-wandering-mountain.solana-mainnet.quiknode.pro/407f5a6819971fa5727ca1529bf37c5700ff6a3b/';

    const connConfig = {httpHeaders: {'referer': 'https://edensol.net'}};
    const connection = new Connection(network, connConfig);

    db.getConnection('Transaction').then((conn) => {
      log.silly('WALLETS-MONITOR: successfully connected to db');
      const repo = model.transactionRepository(conn);

      // Fire and forget
      addLatestTransactions(repo, connection).then((_) => {
        isJobInProgress = false; log.info('WALLETS-MONITOR: job ended');
      }).catch((err) => {
        isJobInProgress = false; log.error(new Exception({message: 'WALLETS-MONITOR: job error', innerError: err}));
      });
    }).catch((err) => {
      isJobInProgress = false; log.error(new Exception({message: 'WALLETS-MONITOR: job error', innerError: err}));
    });
  } catch (err) {
    isJobInProgress = false; log.error(new Exception({message: 'WALLETS-MONITOR: job error', innerError: err}));
  }
};

/*
finds all wallets that have to be searched and looks up newest transaction on
blockchain to sync them with local db
*/
const addLatestTransactions = async (transactionRepository, connection) => {
  log.silly('WALLETS-MONITOR: triggering add latest transactions');

  const wallets = _.uniq(_.values(walletsConfig.hero));
  for (let i = 0; i < wallets.length; i++) {
    const savedTransactions = await transactionRepository.getTransactions();
    let latestBlockTime = 0;
    for (let j = 0; j < savedTransactions.length; j++) {
      if (savedTransactions[j].blockTime > latestBlockTime) {
        latestBlockTime = savedTransactions[j].blockTime;
      }
    }

    const solPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')).data.solana.usd;

    let scrapedTransactions = await getSolTransactionsOfUser(wallets[i], {limit: 20}, connection);
    for (let j = 0; j < scrapedTransactions.length; j++) {
      if (scrapedTransactions[j].blockTime > latestBlockTime &&
          (scrapedTransactions[j].solChange > 0 ||
            scrapedTransactions[j].usdcChange > 0 ||
            scrapedTransactions[j].usdtChange > 0)) {
        log.info(`WALLETS-MONITOR: found new transaction! ${JSON.stringify(scrapedTransactions[j])}`);
        scrapedTransactions[j].solRate = solPrice;
        await transactionRepository.createTransaction(scrapedTransactions[j]);
      }
    }

    let associatedUsdcTokenAddr = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new PublicKey(wallets[i])
    );
    if (associatedUsdcTokenAddr) {
      scrapedTransactions = await getUsdTransactionsOfUser(wallets[i], associatedUsdcTokenAddr.toBase58(), {limit: 20}, connection);
      for (let j = 0; j < scrapedTransactions.length; j++) {
        if (scrapedTransactions[j].blockTime > latestBlockTime &&
            (scrapedTransactions[j].solChange > 0 ||
              scrapedTransactions[j].usdcChange > 0 ||
              scrapedTransactions[j].usdtChange > 0)) {
          log.info(`WALLETS-MONITOR: found new transaction! ${JSON.stringify(scrapedTransactions[j])}`);
          scrapedTransactions[j].solRate = solPrice;
          await transactionRepository.createTransaction(scrapedTransactions[j]);
        }
      }
    }

    associatedUsdcTokenAddr = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
      new PublicKey(wallets[i])
    );
    if (associatedUsdcTokenAddr) {
      scrapedTransactions = await getUsdTransactionsOfUser(wallets[i], associatedUsdcTokenAddr.toBase58(), {limit: 20}, connection);
      for (let j = 0; j < scrapedTransactions.length; j++) {
        if (scrapedTransactions[j].blockTime > latestBlockTime &&
            (scrapedTransactions[j].solChange > 0 ||
              scrapedTransactions[j].usdcChange > 0 ||
              scrapedTransactions[j].usdtChange > 0)) {
          log.info(`WALLETS-MONITOR: found new transaction! ${JSON.stringify(scrapedTransactions[j])}`);
          scrapedTransactions[j].solRate = solPrice;
          await transactionRepository.createTransaction(scrapedTransactions[j]);
        }
      }
    }
  }
};

const getSolTransactionsOfUser = async (walletAddress, options, connection) => {
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
    }

    const transWithSignature = {
      signature,
      walletAddress,
      authority: confirmedTransaction.transaction.feePayer.toBase58(),
      blockTime: confirmedTransaction.blockTime,
      solChange: (solChange > 0) ? solChange / 1000000000 : 0,
      usdcChange: (usdcChange > 0) ? usdcChange : 0,
      usdtChange: (usdtChange > 0) ? usdtChange : 0,
    };
    transactions.push(transWithSignature);
  }

  return transactions;
};

const getUsdTransactionsOfUser = async (wallet, accountAddress, options, connection) => {
  const USDCmint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  const USDTmint = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

  const publicKey = new PublicKey(accountAddress);
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

    if (meta.preTokenBalances[0] != undefined) {
      if (meta.preTokenBalances[0].mint === USDCmint) {
        usdcChange = meta.postTokenBalances[0].uiTokenAmount.uiAmount - ((meta.preTokenBalances[0].owner == wallet) ? meta.preTokenBalances[0].uiTokenAmount.uiAmount : 0);
      }
      if (meta.preTokenBalances[0].mint === USDTmint) {
        usdcChange = meta.postTokenBalances[0].uiTokenAmount.uiAmount - ((meta.preTokenBalances[0].owner == wallet) ? meta.preTokenBalances[0].uiTokenAmount.uiAmount : 0);
      }
    }

    const transWithSignature = {
      signature,
      walletAddress: accountAddress,
      authority: confirmedTransaction.transaction.feePayer.toBase58(),
      blockTime: confirmedTransaction.blockTime,
      solChange: (solChange > 0) ? solChange / 1000000000 : 0,
      usdcChange: (usdcChange > 0) ? usdcChange : 0,
      usdtChange: (usdtChange > 0) ? usdtChange : 0,
    };
    transactions.push(transWithSignature);
  }

  return transactions;
};

// cron runs every 30 seconds, check https://crontab.guru/ for more
// info on cron expressions
export default cron.schedule('*/30 * * * * *', main, {scheduled: false});
