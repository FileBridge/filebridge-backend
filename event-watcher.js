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

/*
ethChainId =  1
fevmChainId = 3141
maticChainId = 137
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

  try {
    const hash = await redeemTokenHashGenerator(provider, contract, to, chainId, token, amount)
    const signingKey = new ethers.utils.SigningKey(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    )
    const sig = signingKey.signDigest(hash)
    const tokensDeposited = await redeemToken(provider, contract, to, chainId, token, amount, sig.r, sig.vs)
    if (!tokensDeposited) return
    console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
  } catch (err) {
    console.error('Error processing transaction', err)
    // TODO: return funds
    }

}

/* For the Bridge back
const handleDestinationEvent = async (
  event,
  provider,
  contract,
  providerDest,
  contractDest
) => {
  const { to, chainId, token, amount } = event.returnValues
  console.log('handleDestinationEvent')
  console.log('to :>> ', to)
  console.log('from :>> ', from)
  console.log('value :>> ', value)
  console.log('============================')

  if (from == process.env.WALLET_ZERO) {
    console.log('Tokens minted')
    return
  }

  if (to == BRIDGE_WALLET && to != from) {
    console.log(
      'Tokens received on bridge from destination chain! Time to bridge back!'
    )

    try {
      // we need to approve burn, then burn
      const tokenBurnApproved = await approveForBurn(
        providerDest,
        contractDest,
        value
      )
      if (!tokenBurnApproved) return
      console.log('Tokens approved to be burnt')
      const tokensBurnt = await burnTokens(providerDest, contractDest, value)

      if (!tokensBurnt) return
      console.log(
        'Tokens burnt on destination, time to transfer tokens in ETH side'
      )
      const transferBack = await transferToEthWallet(
        provider,
        contract,
        value,
        from
      )
      if (!transferBack) return

      console.log('Tokens transfered to ETH wallet')
      console.log('🌈🌈🌈🌈🌈 Bridge back operation completed')
    } catch (err) {
      console.error('Error processing transaction', err)
      // TODO: return funds
    }
  } else {
    console.log('Something else triggered Transfer event')
  }
}*/

const main = async () => {''
  const ethWebSockerProvider = new Web3(process.env.ETH_WSS_ENDPOINT) //with the Id I need to determine what is the originWebSockerProvider IS NOT A CONSTANT
  const fevmWebSockerProvider = new Web3(process.env.FEVM_WSS_ENDPOINT) //with the Id i need to determine what is the destinationWebSockerProvider IS NOT A CONSTANT
  // adds account to sign transactions
  ethWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY)
  fevmWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY)

  const ethNetworkId = await ethWebSockerProvider.eth.net.getId() // I have the Id in the event
  const fevmNetworkId = await fevmWebSockerProvider.eth.net.getId() //I have the Id in the event

  console.log('oriNetworkId :>> ', ethNetworkId)
  console.log('destNetworkId :>> ', fevmNetworkId)

  const ethTokenContract = new ethWebSockerProvider.eth.Contract(
    DAI_ABIJSON.abi,
    ETH_CONTRACT_ADDRESS
  )

  const fevmTokenContract =
    new fevmWebSockerProvider.eth.Contract(
      FDAI_ABIJSON.abi,
      FEVM_CONTRACT_ADDRESS
    )

  let options = {
    // filter: {
    //   value: ['1000', '1337'], //Only get events where transfer value was 1000 or 1337
    // },
    // fromBlock: 0, //Number || "earliest" || "pending" || "latest"
    // toBlock: 'latest',
  }

  ethTokenContract.events //that is a constant with the contract address and the token
    .Transfer(options)
    .on('data', async (event) => {
      const { to, chainId, token, amount } = event.returnValues
      if (chainId == maticChainId) {
        // In case we want to add it. 

      } else if (chainId == fevmChainId) {
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
  
  /* That will be for the bridge back
  destinationTokenContract.events
    .Transfer(options)
    .on('data', async (event) => {
      await handleDestinationEvent(
        event,
        originWebSockerProvider,
        originTokenContract,
        destinationWebSockerProvider,
        destinationTokenContract
      )
    })
    .on('error', (err) => {
      console.error('Error: ', err)
    })
    */
  console.log(
    `Waiting for Transfer events on ${FEVM_CONTRACT_ADDRESS}`
  )
}

main()
