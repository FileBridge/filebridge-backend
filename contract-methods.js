const GOERLI_WSS_ENDPOINT = process.env.GOERLI_WSS_ENDPOINT
const GOERLI_HTTPS_ENDPOINT = process.env.GOERLI_HTTPS_ENDPOINT
const GOERLI_TOKEN_CONTRACT_ADDRESS = process.env. GOERLI_TOKEN_CONTRACT_ADDRESS
const HYPERSPACE_WSS_ENDPOINT = process.env.HYPERSPACE_WSS_ENDPOINT
const HYPERSPACE_HTTPS_ENDPOINT = process.env.HYPERSPACE_HTTPS_ENDPOINT
const HYPERSPACE_TOKEN_CONTRACT_ADDRESS = process.env.HYPERSPACE_TOKEN_CONTRACT_ADDRESS
//const MUMBAI_WSS_ENDPOINT = process.env.MUMBAI_WSS_ENDPOINT
//const MUMBAI_HTTPS_ENDPOINT = process.env.MUMBAI_HTTPS_ENDPOINT
//const MUMBAI_FDAI_CONTRACT_ADDRESS = process.env. MUMBAI_TOKEN_CONTRACT_ADDRESS
const BRIDGE_WALLET_KEY = process.env.BRIDGE_WALLET
const BRIDGE_PRIV_KEY = process.env.BRIDGE_PRIV_KEY
const GOERLI_EXPLORER = process.env.GOERLI_EXPLORER
const HYPERSPACE_EXPLORER = process.env.HYPERSPACE_EXPLORER
const WALLET_ZERO = process.env.WALLET_ZERO

//Main functions needed

GoerliChainId =  5
HyperSpaceChainId = 3141

const depositToken = async (provider, contract, to, chainId, token, amount) => {
  
  try {
    const receipt = await contract.methods.depositToken(to, chainId, token, amount)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    if (chainId == GoerliChainId) {
      console.log(
        `depositTokens > You can see this transaction in ${process.env.GOERLI_EXPLORER}${receipt.transactionHash}`
      )
    }else if (chainId == HyperSpaceChainId) {
      console.log(
        `depositTokens > You can see this transaction in ${process.env.HYPERSPACE_EXPLORER}${receipt.transactionHash}`
      )

    }
  } catch (error) {
    console.error('Error in deposit >', error)
    return false
  }
}
const depositFToken = async (provider, contract, to, chainId, fToken, amount) => {

  try {
    const receipt = await contract.methods.depositFToken(to, chainId, fToken, amount)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    if (chainId == GoerliChainId) {
      console.log(
        `depositTokens > You can see this transaction in ${process.env.GOERLI_EXPLORER}${receipt.transactionHash}`
      )
    }else if (chainId == HyperSpaceChainId) {
      console.log(
        `depositTokens > You can see this transaction in ${process.env.HYPERSPACE_EXPLORER}${receipt.transactionHash}`
      )

    }
  } catch (error) {
    console.error('Error in deposit >', error)
    return false
  }
}
/*
const depositNativeToken = async (provider, contract, to, chainId, fToken, amount) => {
  try {
    const receipt = await contract.methods.depositNativeToken(to, chainId, fToken, amount)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `depositTokens > You can see this transaction in ${process.env.ORIGIN_EXPLORER}${receipt.transactionHash}`
    )
  } catch (error) {
    console.error('Error in deposit >', error)
    return false
  }
}*/
const redeemTokenHashGenerator = async(provider, contract, to, chainId, token, amount, nonce) => {
  try {
    const receipt = await contract.methods.redeemTokenHashGenerator(to, chainId, token, amount, nonce)
    /*console.log(`Transaction signature, hash is ${receipt.transactionHash}`)*/
    return receipt

  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const redeemFTokenHashGenerator = async(provider, contract, to, chainId, fToken, amount, nonce) => {
  try {
    const receipt = await contract.methods.redeemFTokenHashGenerator(to, chainId, fToken, amount, nonce)
    console.log(`Transaction signature, hash is ${receipt.transactionHash}`)
    return receipt

  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
/*
const redeemNativeTokenHashGenerator = async(provider, contract, to, chainId, amount, nonce) => {
  try {
    const receipt = await contract.methods.redeemNativeTokenHashGenerator(to, chainId, amount, nonce)
    console.log(`Transaction signature, hash is ${receipt.transactionHash}`)
    return receipt

  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}*/
const redeemToken = async (provider, contract, to, chainId, token, amount, _signer, r, vs)=> {
  try {
    const receipt = await contract.methods.redeemToken(to, chainId, token, amount, _signer, r,vs)
    /*console.log(`Transaction sent, hash is ${receipt.transactionHash}`)*/
    /*console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)*/
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const redeemFToken = async (provider, contract, to, chainId, fToken, amount, _signer, r, vs)=> {
  try {
    const receipt = await contract.methods.redeemFToken(to, chainId, fToken, amount, _signer, r,vs)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
 
/*
const redeemNativeToken = async (provider, contract, to, chainId, amount, _signer, r, vs)=> {
  try {
    const receipt = await contract.methods.redeemNativeToken(to, chainId, fToken, amount, _signer, r,vs)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}*/

const nonces = async (provider, contract, _address)=> {
  try {
    const nonce = await contract.methods.nonces(_address)
    //console.log(`Transaction sent, hash is ${nonce.transactionHash}`)
    /*console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)*/
    console.log(`nonce is ${nonce}`)
    return nonce
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}

/* ******************************************************************* */

const addedToListToken = async (provider, contract, _token, _fToken)=> {
  try {
    const receipt = await contract.methods.addWToken(_token, _fToken)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const removedFromListToken = async (provider, contract, _token)=> {
  try {
    const receipt = await contract.methods.removeWToken(_token)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const changedInListToken = async (provider, contract, _token, _fToken)=> {
  try {
    const receipt = await contract.methods.changeWToken(_token)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}

module.exports = {
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
}
