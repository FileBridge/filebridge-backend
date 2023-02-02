const Web3 = require('web3')

//load env file
require('dotenv').config()

const {
  addedToListToken,
  removedFromListToken,
  changedInListToken,
  depositToken,
  redeemToken,
  redeemTokenHashGenerator
} = require('./contract-methods.js')

const ETH_CONTRACT_ADDRESS = process.env.ETH_TOKEN_CONTRACT_ADDRESS //Cuidado porque el token va cambiando así que pueden ser varios NO CONSTANTE
const FEVM_CONTRACT_ADDRESS = process.env.FVM_TOKEN_CONTRACT_ADDRESS //Cuidado porque el token va cambiando así que pueden ser varios NO CONSTANTE
const BRIDGE_WALLET = process.env.BRIDGE_WALLET

const BRIDGE_WALLET_KEY = process.env.BRIDGE_PRIV_KEY

ethChainId =  5 //Goerli ChainId
fevmChainId = 3141 //HyperSpace Chain Id
maticChainId = 80001 //Mumbai ChainId

const DAI_ABIJSON = require('./DAI.json')
const FDAI_ABIJSON = require('./FDAI.json')

const handleDepositEvent = async (event, provider, contract) => { //function that is called when a bridge to FEVM network from ETH. 
  console.log('handleDepositEvent')
  const { to, chainId, token, amount } = event.returnValues //we get the event values
  console.log('to :>> ', to)
  console.log('chainId :>> ', chainId)
  console.log('token :>> ', token)
  console.log('amount :>> ', amount)
  console.log('============================')

  console.log('Tokens received on bridge from ETH chain! Time to bridge!')
  //First we build the hash of the transaction in the other chain. 
  try {
    const hash = await redeemTokenHashGenerator(provider, contract, to, chainId, token, amount)
    //That is the wallet key to sign the transaction, will need to be stored in an API and not hardcoded. 
    const signingKey = new ethers.utils.SigningKey(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    )
    // We sign the transaction
    const sig = signingKey.signDigest(hash)
    //We call the function redeemToken with the previous signature. 
    const tokensDeposited = await redeemToken(provider, contract, to, chainId, token, amount, sig.r, sig.vs)
    if (!tokensDeposited) return
    console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
  } catch (err) {
    console.error('Error processing transaction', err)
    // TODO: return funds
    }

}


const main = async () => {''
  const ethWebSockerProvider = new Web3(process.env.ETH_WSS_ENDPOINT) // Goerli Testnet node provider
  const fevmWebSockerProvider = new Web3(process.env.FEVM_WSS_ENDPOINT) // Hyperspace Testnet node provider
  
  // adds account to sign transactions
  ethWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY) //For now not used, the key is hardcoded. 
  fevmWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY) // Missing

  const ethNetworkId = await ethWebSockerProvider.eth.net.getId() // I have the Id in the event
  const fevmNetworkId = await fevmWebSockerProvider.eth.net.getId() //I have the Id in the event

  console.log('oriNetworkId :>> ', ethNetworkId)
  console.log('destNetworkId :>> ', fevmNetworkId)

  const ethTokenContract = new ethWebSockerProvider.eth.Contract( // Token and contract the provider is listening, FDAI in ETH
    DAI_ABIJSON.abi,
    ETH_CONTRACT_ADDRESS
  )

  const fevmTokenContract = new fevmWebSockerProvider.eth.Contract( // Token and contract the provider is listening, FDAI in FEVM
      FDAI_ABIJSON.abi,
      FEVM_CONTRACT_ADDRESS
    )

  ethTokenContract.events //that is a constant with the contract address and the token
    .Transfer(options)
    .on('data', async (event) => { //gets the data when an events happens
      const { to, chainId, token, amount } = event.returnValues //safe the values from the event
      if (chainId == maticChainId) { //we check to what chain wants to be send, and we call the function for that network.
        // In case we want to add it. 

      } else if (chainId == fevmChainId) {//we check to what chain wants to be send, and we call the function for that network.
        await handleDepositEvent(
          event,
          femWebSockerProvider, 
          fevmTokenContract
        )

      }
    })
    .on('error', (err) => {
      console.error('Error: ', err)
    })
  console.log(`Waiting for Transfer events on ${ETH_CONTRACT_ADDRESS}`)
  
}

main()
