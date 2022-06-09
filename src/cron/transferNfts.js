import cron from 'node-cron';
import web3 from '@solana/web3.js';
import {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token} from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import {logger as log, db} from '../util/index.js';
import model from '../model/index.js';
import {Exception} from '../exceptions/index.js';
import _ from 'underscore';

const wallet = anchor.Wallet.local();
let isJobInProgress = false;

const main = () => {
  try {
    if (isJobInProgress) {
      log.info('TRANSFER-NFTS: prev job instance still in progress...');
      return;
    }
    log.info('TRANSFER-NFTS: job starting...');
    isJobInProgress = true;

    // TODO: add network in config?
    const network = 'https://api.mainnet-beta.solana.com';
    const connection = new web3.Connection(network, 'confirmed');

    db.getConnection('Processing').then((conn) => {
      log.silly('TRANSFER-NFTS: successfully connected to db');
      const processingRepo = model.processingRepository(conn);
      const nftsRepo = model.nftsRepository(conn);
      const transactionRepo = model.transactionRepository(conn);

      // Fire and forget
      processingRepo.getLastBlock().then((lastBlock) => {
        lastBlock = lastBlock || {lastBlock: 0};

        if (lastBlock.lastBlock == 0) {
          log.warn('Last block not set - NFT processing aborted');
        } else {
          log.info(`NFT processing starts at block ${lastBlock.lastBlock}`);

          // TODO optimize by block time
          transactionRepo.getTransactions().then(transactions => {
            processTransactions(transactions, lastBlock, nftsRepo, connection, processingRepo).then(_ => {
              isJobInProgress = false; log.info('TRANSFER-NFTS: job ended');
            }).catch((err) => {
              isJobInProgress = false; log.error(new Exception({message: 'TRANSFER-NFTS: job error', innerError: err}));
            });
          }).catch((err) => {
            isJobInProgress = false; log.error(new Exception({message: 'TRANSFER-NFTS: job error', innerError: err}));
          });
        }
      }).catch((err) => {
        isJobInProgress = false; log.error(new Exception({message: 'TRANSFER-NFTS: job error', innerError: err}));
      });
    }).catch((err) => {
      isJobInProgress = false; log.error(new Exception({message: 'TRANSFER-NFTS: job error', innerError: err}));
    });
  } catch (err) {
    isJobInProgress = false; log.error(new Exception({message: 'TRANSFER-NFTS: job error', innerError: err}));
  }
};

const processTransactions = async (transactions, lastBlock, nftsRepo, connection, processingRepo) => {
  for (let transactionIndex in _.sortBy(transactions, transaction => transaction.blockTime)) {
    let transaction = transactions[transactionIndex];
    if (transaction.blockTime > lastBlock.lastBlock) { // TODO last id
      let howMuch = 0;
      if (transaction.solChange > 0) {
        howMuch = Math.floor(transaction.solChange * transaction.solRate / 77);
      } else if (Math.max(transaction.usdcChange, transaction.usdtChange) > 0) {
        howMuch = Math.floor(Math.max(transaction.usdcChange, transaction.usdtChange) / 79);
      }

      await transferNfts(howMuch, nftsRepo, connection, transaction, lastBlock, processingRepo);
    }
  }
}

const transferNfts = async (howMuch, nftsRepo, connection, transaction, lastBlock, processingRepo) => {
  for (let i = 0; i < howMuch; i++) {
    const nfts = await nftsRepo.getNfts();

    let foundNft = false;
    const allKeys = _.allKeys(nfts.hero.common);
    for (let nftHashIndex in allKeys) {
      const nftHash = allKeys[nftHashIndex];
      if (!nfts.hero.common[nftHash].transferedTo) {
        lastBlock.lastBlock = Math.max(lastBlock.lastBlock, transaction.blockTime);
        await processingRepo.setLastBlock(lastBlock.lastBlock);
        await nftsRepo.setNftTransfered(nftHash, transaction.authority);

        // If transfer will fail we will need to resolve manually - TODO email
        await transferNft(connection, nftHash, transaction.authority);

        foundNft = true;
        break;
      }
    }

    if (!foundNft) {
      throw new Exception({ message: 'TRANSFER-NFTS: no NFTs remaining' });
    }
  }
}

const transferNft = async (connection, nftToTransfer, destinationAddress) => {
  log.info(`TRANSFER-NFTS: Starting nft transfer - [${nftToTransfer}] to [${destinationAddress}]`);

  const destPublicKey = new web3.PublicKey(destinationAddress);
  const mintPublicKey = new web3.PublicKey(nftToTransfer);

  // GET SOURCE ASSOCIATED ACCOUNT
  const associatedSourceTokenAddr = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintPublicKey,
    wallet.publicKey
  );

  // GET DESTINATION ASSOCIATED ACCOUNT
  const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintPublicKey,
    destPublicKey
  );

  const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);

  const instructions = [];

  if (receiverAccount === null) {
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintPublicKey,
        associatedDestinationTokenAddr,
        destPublicKey,
        wallet.publicKey
      )
    );
  }

  instructions.push(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      associatedSourceTokenAddr,
      associatedDestinationTokenAddr,
      wallet.publicKey,
      [],
      1
    )
  );
  const transaction = new web3.Transaction();
  instructions?.forEach((instruction) => {
    transaction.add(instruction);
  });
  const blockhash = await connection.getLatestBlockhash('finalized');
  transaction.recentBlockhash = blockhash.blockhash;
  transaction.feePayer = wallet.publicKey;

  let signed = await wallet.signTransaction(transaction);
  let signature = await connection.sendRawTransaction(signed.serialize());
  return connection.confirmTransaction(signature);
}

// cron runs every 16 seconds, check https://crontab.guru/ for more
// info on cron expressions
export default cron.schedule('*/16 * * * * *', main, {scheduled: false});
