const { ethers } = require("ethers");
const {
  SigningKey,

  computePublicKey,
  recoverPublicKey,
} = require("@ethersproject/signing-key");
const Web3 = require("web3");

const FileBridgeJson = require("./FileBridge.json");

//load env file
require("dotenv").config();

const {
  depositToken,
  depositFToken,
  //depositNativeToken,

  redeemToken,
  redeemFToken,
  //redeemNativeToken,

  redeemTokenHashGenerator,
  redeemFTokenHashGenerator,
  //redeemNativeTokenHashGenerator,

  nonces,

  addedToListToken,
  removedFromListToken,
  changedInListToken,
} = require("./contract-methods.js");

const GOERLI_WSS_ENDPOINT = process.env.GOERLI_WSS_ENDPOINT;
const GOERLI_HTTPS_ENDPOINT = process.env.GOERLI_HTTPS_ENDPOINT;
const GOERLI_FDAI_CONTRACT_ADDRESS = process.env.GOERLI_TOKEN_CONTRACT_ADDRESS;
const HYPERSPACE_WSS_ENDPOINT = process.env.HYPERSPACE_WSS_ENDPOINT;
const HYPERSPACE_HTTPS_ENDPOINT = process.env.HYPERSPACE_HTTPS_ENDPOINT;
const HYPERSPACE_FDAI_CONTRACT_ADDRESS =
  process.env.HYPERSPACE_TOKEN_CONTRACT_ADDRESS;
const BRIDGE_WALLET = process.env.BRIDGE_WALLET;
const MUMBAI_WSS_ENDPOINT = process.env.MUMBAI_WSS_ENDPOINT
const MUMBAI_HTTPS_ENDPOINT = process.env.MUMBAI_HTTPS_ENDPOINT
const MUMBAI_FDAI_CONTRACT_ADDRESS = process.env. MUMBAI_TOKEN_CONTRACT_ADDRESS
const BRIDGE_PRIV_KEY = process.env.BRIDGE_PRIV_KEY;
const GOERLI_EXPLORER = process.env.GOERLI_EXPLORER;
const HYPERSPACE_EXPLORER = process.env.HYPERSPACE_EXPLORER;
const WALLET_ZERO = process.env.WALLET_ZERO;

const web3 = new Web3(new Web3.providers.HttpProvider(GOERLI_HTTPS_ENDPOINT));

/*
GoerliChainId =  5
HyperSpaceChainId = 3141
mumbaiChainId =
*/
/*
const chainMap = {
  5: GOERLI_HTTPS_ENDPOINT,
  3141: HYPERSPACE_HTTPS_ENDPOINT,
};*/

const DAI_ABIJSON = require("./DAI.json");
const FDAI_ABIJSON = require("./FileBridge.json");


const handleTokenDepositEvent = async (event, provider, contract) => {
  console.log("handleDepositEvent");
  const { to, chainId, token, amount } = event.returnValues;
  console.log("to :>> ", to);
  console.log("chainId :>> ", chainId);
  console.log("token :>> ", token);
  console.log("amount :>> ", amount);
  console.log("============================");

  console.log("Tokens received on bridge from ETH chain! Time to bridge!");
  try {
    const provider__ = ethers.getDefaultProvider(//ChainMap[ChainId]);
      process.env.HYPERSPACE_WSS_ENDPOINT
    );
    const wallet__ = new ethers.Wallet(BRIDGE_PRIV_KEY, provider__);
    const fileBridgeContract = new ethers.Contract(
      FileBridgeJson.address,
      FileBridgeJson.abi
    ).connect(wallet__);
    console.log("calling the nonces");
    
    const nonce = await fileBridgeContract.nonces(BRIDGE_WALLET);

    console.log(`nonce :>> ${nonce.toString()}`);
    console.log("calling the redeemTokenHashGenerator");
    const hash = await fileBridgeContract.redeemTokenHashGenerator(
      to,
      chainId,
      token,
      amount,
      nonce
    );
    console.log(`hash :>> ${hash}`);
    console.log("Transactioncount", Web3.eth.getTransactionCount(BRIDGE_WALLET));
    console.log("calling the signingKey");


    const signingKey = new SigningKey(BRIDGE_PRIV_KEY);
    const sig = signingKey.signDigest(hash);

    console.log("---------------------------------------------------------");
    console.log(sig);

    //web3.eth.accounts.sign(data, privateKey);
    console.log("calling the signDigest");

    console.log("calling the redeemToken");
    console.log(wallet__.address);
    const txResponse = await fileBridgeContract.redeemToken(
      to,
      chainId,
      token,
      amount,
      BRIDGE_WALLET,
      sig.r,
      sig._vs
    );
    console.log(`sent with hash :>> ${txResponse.hash}`);
    if (!tokensDeposited) return;
    console.log("🌈🌈🌈🌈🌈 Bridge to destination completed");
    if (!tokensDeposited) return;
    console.log("🌈🌈🌈🌈🌈 Bridge to destination completed");
  } catch (err) {
    console.error("Error processing transaction", err);
    // TODO: return funds
  }
  /*else if (event == NativeTokenDeposited) {
    
  }*/
};

const handleFTokenDepositEvent = async (event, provider, contract) => {
  console.log("handleDepositEvent");
  const { to, chainId, token, amount } = event.returnValues;
  console.log("to :>> ", to);
  console.log("chainId :>> ", chainId);
  console.log("token :>> ", token);
  console.log("amount :>> ", amount);
  console.log("============================");

  console.log("Tokens received on bridge from ETH chain! Time to bridge!");
  try {
    const provider__ = ethers.getDefaultProvider(
      process.env.HYPERSPACE_WSS_ENDPOINT
    );
    const wallet__ = new ethers.Wallet(BRIDGE_PRIV_KEY, provider__);
    const fileBridgeContract = new ethers.Contract(
      FileBridgeJson.address,
      FileBridgeJson.abi
    ).connect(wallet__);
    console.log("calling the nonces");
    // const nonce = await nonces(provider, contract, BRIDGE_WALLET);
    const nonce = await fileBridgeContract.nonces(BRIDGE_WALLET);
    console.log(`nonce :>> ${nonce.toString()}`);
    console.log("calling the redeemFTokenHashGenerator");
    const hash = await fileBridgeContract.redeemFTokenHashGenerator(
      to,
      chainId,
      token,
      amount,
      nonce
    );
    console.log(`hash :>> ${hash}`);
    console.log("calling the signingKey");

    //const sig = new web3.eth.personal.sign(hash, BRIDGE_WALLET, BRIDGE_PRIV_KEY)
    //web3.eth.accounts.signTransaction(tx, privateKey [, callback]);
    // const sig = Web3.eth.signTransaction(hash, BRIDGE_PRIV_KEY);
    // console.log(hash);
    const signingKey = new SigningKey(BRIDGE_PRIV_KEY);
    const sig = signingKey.signDigest(hash);

    console.log("---------------------------------------------------------");
    console.log(sig);

    //web3.eth.accounts.sign(data, privateKey);
    console.log("calling the signDigest");
    //const sig = signingKey.signDigest(hash)
    console.log("calling the redeemToken");
    console.log(wallet__.address);
    const txResponse = await fileBridgeContract.redeemFToken(
      to,
      chainId,
      token,
      amount,
      BRIDGE_WALLET,
      sig.r,
      sig._vs
    );
    console.log(`sent with hash :>> ${txResponse.hash}`);
    if (!tokensDeposited) return;
    console.log("🌈🌈🌈🌈🌈 Bridge to destination completed");
    if (!tokensDeposited) return;
    console.log("🌈🌈🌈🌈🌈 Bridge to destination completed");
  } catch (err) {
    console.error("Error processing transaction", err);
    // TODO: return funds
  }
  /*else if (event == NativeTokenDeposited) {
    
  }*/
};

const main = async () => {
  const goerliWebSockerProvider = new Web3(process.env.GOERLI_WSS_ENDPOINT); //with the Id I need to determine what is the originWebSockerProvider IS NOT A CONSTANT
  const hyperspaceWebSockerProvider = new Web3(process.env.HYPERSPACE_WSS_ENDPOINT); //with the Id i need to determine what is the destinationWebSockerProvider IS NOT A CONSTANT
  const mumbaiWebSockerProvider = new Web3(process.env.MUMBAI_WSS_ENDPOINT);
  // adds account to sign transactions
  console.log("BRIDGE_WALLET:>> ", BRIDGE_WALLET);
  goerliWebSockerProvider.eth.accounts.wallet.add(BRIDGE_PRIV_KEY);
  hyperspaceWebSockerProvider.eth.accounts.wallet.add(BRIDGE_PRIV_KEY);
  //mumbaiWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET)

  const goerliNetworkId = await goerliWebSockerProvider.eth.net.getId(); // I have the Id in the event
  const hyperspaceNetworkId = await hyperspaceWebSockerProvider.eth.net.getId(); //I have the Id in the event
  //const mumbaiNetworkId = await mumbaiWebSockerProvider.eth.net.getId()

  console.log("Goerli NetworkId :>> ", goerliNetworkId);
  console.log("HyperSpace NetworkId :>> ", hyperspaceNetworkId);
  //console.log('Mumbai NetworkId :>> ', mumbaiNetworkId)

  // Contracts and tokens we want to listen from.

  const goerliFDAIContract = new goerliWebSockerProvider.eth.Contract(
    FDAI_ABIJSON.abi,
    GOERLI_FDAI_CONTRACT_ADDRESS
  );

  const hyperspaceFDAIContract = new hyperspaceWebSockerProvider.eth.Contract(
    FDAI_ABIJSON.abi,
    HYPERSPACE_FDAI_CONTRACT_ADDRESS
  );
  /*
  const mumbaiFDAIContract = new mumbaiWebSockerProvider.eth.Contract(
  FDAI_ABIJSON.abi,
  MUMBAI_FDAI_CONTRACT_ADDRESS
  )
  */

  //Event-watcher

  const toBlock = "latest";
  const fromBlock = (await web3.eth.getBlockNumber()) - 300;

  //Event-watcher for FDAI in the Goerli network

  goerliFDAIContract.getPastEvents(
    "TokenDeposited",
    {
      fromBlock,
      toBlock,
    },
    (error, events) => {
      if (error) {
        console.error("Error: ", error);
        return;
      }
      console.log("Goerli NetworkId Event TokenDeposited detected");

      events.forEach(async (event) => {
        // Your code here
        const { to, chainId, token, amount } = event.returnValues;
        console.log("Goerli NetworkId eventchainId :>> ", chainId);
        if (chainId == 80001) {
          await handleTokenDepositEvent(
            event,
            mumbaiWebSockerProvider, 
            mumbaiFDAIContract
          );
        } else if (chainId == 3141) {
          console.log(
            "Goerli NetworkId Event TokenDeposited detected Hyperspacecalled"
          );
          await handleTokenDepositEvent(
            event,
            hyperspaceWebSockerProvider,
            hyperspaceFDAIContract
          );
        }
      });
    }
  );
  goerliFDAIContract.getPastEvents(
    "FTokenDeposited",
    {
      fromBlock,
      toBlock,
    },
    (error, events) => {
      if (error) {
        console.error("Error: ", error);
        return;
      }
      console.log("Goerli NetworkId Event TokenDeposited detected");

      events.forEach(async (event) => {
        // Your code here
        const { to, chainId, token, amount } = event.returnValues;
        console.log("Goerli NetworkId eventchainId :>> ", chainId);
        if (chainId == 80001) {
          await handleFTokenDepositEvent(
            event,
            mumbaiWebSockerProvider, 
            mumbaiFDAIContract
        );
        } else if (chainId == 3141) {
          console.log(
            "Goerli NetworkId Event TokenDeposited detected Hyperspacecalled"
          );
          await handleFTokenDepositEvent(
            event,
            hyperspaceWebSockerProvider,
            hyperspaceFDAIContract
          );
        }
      });
    }
  );
  

  //Event-watcher for FDAI in the Hyperspace Network
  hyperspaceFDAIContract.getPastEvents(
    "TokenDeposited",
    {
      fromBlock,
      toBlock,
    },
    (error, events) => {
      if (error) {
        console.error("Error: ", error);
        return;
      }

      events.forEach(async (event) => {
        // Your code here
        const { to, chainId, token, amount } = event.returnValues;
        if (chainId == 80001) {
          await handleTokenDepositEvent(
            event,
            mumbaiWebSockerProvider, 
            mumbaiFDAIContract
          );
        } else if (chainId == goerliNetworkId) {
          await handleTokenDepositEvent(
            event,
            goerliWebSockerProvider,
            goerliFDAIContract
          );
        }
      });
    }
  );
  hyperspaceFDAIContract.getPastEvents(
    "FTokenDeposited",
    {
      fromBlock,
      toBlock,
    },
    (error, events) => {
      if (error) {
        console.error("Error: ", error);
        return;
      }

      events.forEach(async (event) => {
        // Your code here
        const { to, chainId, token, amount } = event.returnValues;
        if (chainId == 80001) {
          await handleFTokenDepositEvent(
            event,
            mumbaiWebSockerProvider, 
            mumbaiFDAIContract
          );
        } else if (chainId == goerliNetworkId) {
          await handleFTokenDepositEvent(
            event,
            goerliWebSockerProvider,
            goerliFDAIContract
          );
        }
      });
    }

  );

};

main();
