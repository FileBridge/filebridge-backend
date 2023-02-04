const Web3 = require('web3')

//load env file
require('dotenv').config()

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
} = require('./contract-methods.js')

const GOERLI_WSS_ENDPOINT = process.env.GOERLI_WSS_ENDPOINT
const GOERLI_HTTPS_ENDPOINT = process.env.GOERLI_HTTPS_ENDPOINT
const GOERLI_FDAI_CONTRACT_ADDRESS = process.env. GOERLI_TOKEN_CONTRACT_ADDRESS
const HYPERSPACE_WSS_ENDPOINT = process.env.HYPERSPACE_WSS_ENDPOINT
const HYPERSPACE_HTTPS_ENDPOINT = process.env.HYPERSPACE_HTTPS_ENDPOINT
const HYPERSPACE_FDAI_CONTRACT_ADDRESS = process.env.HYPERSPACE_TOKEN_CONTRACT_ADDRESS
const BRIDGE_WALLET = process.env.BRIDGE_WALLET
const BRIDGE_PRIV_KEY = process.env.BRIDGE_PRIV_KEY
const GOERLI_EXPLORER = process.env.GOERLI_EXPLORER
const HYPERSPACE_EXPLORER = process.env.HYPERSPACE_EXPLORER
const WALLET_ZERO = process.env.WALLET_ZERO

/*
GoerliChainId =  1
HyperSpaceChainId = 3141
*/

const DAI_ABIJSON = require('./DAI.json')
const FDAI_ABIJSON = require('./FDAI.json')

const handleDepositEvent = async (event, provider, contract) => {
  console.log('handleDepositEvent')
  const { to, chainId, token, amount } = event.returnValues
  console.log('to :>> ', to)
  console.log('chainId :>> ', chainId)
  console.log('token :>> ', token)
  console.log('amount :>> ', amount)
  console.log('============================')

  console.log('Tokens received on bridge from ETH chain! Time to bridge!')
  if (event == TokenDeposited) {
    try {
      const nonce = await nonces(provider, contract, BRIDGE_WALLET)
      const hash = await redeemTokenHashGenerator(provider, contract, to, chainId, token, amount, nonce)
      const signingKey = new ethers.utils.SigningKey(BRIDGE_PRIV_KEY)
      const sig = signingKey.signDigest(hash)
      const tokensDeposited  
      try {
        const nonce = await nonces(provider, contract, BRIDGE_WALLET)
        const hash = await redeemTokenHashGenerator(provider, contract, to, chainId, token, amount, nonce)
        const signingKey = new ethers.utils.SigningKey(BRIDGE_PRIV_KEY)
        const sig = signingKey.signDigest(hash)
        const tokensDeposited = await redeemToken(provider, contract, to, chainId, token, amount, sig.r, sig.vs)
        if (!tokensDeposited) return
        console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
      } catch (err) {
        console.error('Error processing transaction', err)
        // TODO: return funds
        } = await redeemToken(provider, contract, to, chainId, token, amount, sig.r, sig.vs)
      if (!tokensDeposited) return
      console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
    } catch (err) {
      console.error('Error processing transaction', err)
      // TODO: return funds
    }
  } else if (event == FTokenDeposited) {
    try {
      const nonce = await nonces(provider, contract, BRIDGE_WALLET)
      const hash = await redeemFTokenHashGenerator(provider, contract, to, chainId, token, amount, nonce)
      const signingKey = new ethers.utils.SigningKey(BRIDGE_PRIV_KEY)
      const sig = signingKey.signDigest(hash)
      const tokensDeposited  
      try {
        const nonce = await nonces(provider, contract, BRIDGE_WALLET)
        const hash = await redeemFTokenHashGenerator(provider, contract, to, chainId, token, amount, nonce)
        const signingKey = new ethers.utils.SigningKey(BRIDGE_PRIV_KEY)
        const sig = signingKey.signDigest(hash)
        const tokensDeposited = await redeemFToken(provider, contract, to, chainId, token, amount, sig.r, sig.vs)
        if (!tokensDeposited) return
        console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
      } catch (err) {
        console.error('Error processing transaction', err)
        // TODO: return funds
        } = await redeemFToken(provider, contract, to, chainId, token, amount, sig.r, sig.vs)
      if (!tokensDeposited) return
      console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
    } catch (err) {
      console.error('Error processing transaction', err)
      // TODO: return funds
    }
    
  } /*else if (event == NativeTokenDeposited) {
    
  }*/

}

const main = async () => {''
  const goerliWebSockerProvider = new Web3(process.env.GOERLI_WSS_ENDPOINT ) //with the Id I need to determine what is the originWebSockerProvider IS NOT A CONSTANT
  const hyperspaceWebSockerProvider = new Web3(process.env.HYPERSPACE_WSS_ENDPOINT) //with the Id i need to determine what is the destinationWebSockerProvider IS NOT A CONSTANT
  
  // adds account to sign transactions
  goerliWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY)
  hyperspaceWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY)

  const goerliNetworkId = await goerliWebSockerProvider.eth.net.getId() // I have the Id in the event
  const hyperspaceNetworkId = await hyperspaceWebSockerProvider.eth.net.getId() //I have the Id in the event

  console.log('oriNetworkId :>> ', goerliNetworkId)
  console.log('destNetworkId :>> ', hyperspaceNetworkId)

  // Contracts and tokens we want to listen from. 

  const goerliFDAIContract = new goerliWebSockerProvider.eth.Contract(
    FDAI_ABIJSON.abi,
    GOERLI_FDAI_CONTRACT_ADDRESS
  )

  const hyperspaceFDAIContract = new hyperspaceWebSockerProvider.eth.Contract(
    FDAI_ABIJSON.abi,
    HYPERSPACE_FDAI_CONTRACT_ADDRESS
  )

  //Event-watcher

  //Event-watcher for FDAI in the Goerli network

  goerliFDAIContract.events //that is a constant with the contract address and the token
    .Transfer(options)
    .on('data', async (event) => {
      const { to, chainId, token, amount } = event.returnValues
      if (chainId == maticChainId) {
        // In case we want to add it. 
      } else if (chainId == hyperspaceNetworkId) {
        await handleDepositEvent(
          event,
          hyperspaceWebSockerProvider, 
          hyperspaceFDAIContract
        )
      }
    })
    .on('error', (err) => {
      console.error('Error: ', err)
    })
  console.log(`Waiting for Transfer events on ${HYPERSPACE_TOKEN_CONTRACT_ADDRESS}`)

//Event-watcher for FDAI in the Hyperspace Network

  hyperspaceFDAIContract.events //that is a constant with the contract address and the token
  .Transfer(options)
  .on('data', async (event) => {
    const { to, chainId, token, amount } = event.returnValues
    if (chainId == maticChainId) {
      // In case we want to add it. 
    } else if (chainId == goerliNetworkId) {
      await handleDepositEvent(
        event,
        goerliWebSockerProvider, 
        goerliFDAIContract
      )
    }token
  })
  .on('error', (err) => {
    console.error('Error: ', err)
  })
console.log(`Waiting for Transfer events on ${GOERLI_FDAI_CONTRACT_ADDRESS}`) 
}

main()
