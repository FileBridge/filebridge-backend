const BRIDGE_WALLET = process.env.BRIDGE_WALLET
const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS
const DESTINATION_TOKEN_CONTRACT_ADDRESS = process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS
const ORIGIN_EXPLORER = process.env.ORIGIN_EXPLORER
const DESTINATION_EXPLORER = process.env.DESTINATION_EXPLORER

//Main functions needed

const depositToken = async (provider, contract, to, chainId, token, amount) => {
  try {
    const receipt = await contract.methods.depositToken(to, chainId, token, amount)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `depositTokens > You can see this transaction in ${process.env.ORIGIN_EXPLORER}${receipt.transactionHash}`
    )
  } catch (error) {
    console.error('Error in deposit >', error)
    return false
  }
}
const redeemToken = async (provider, contract, to, chainId, token, amount, r, vs)=> {
  try {
    const receipt = await contract.methods.redeemToken(to, chainId, token, amount, r,vs)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}

//Probably not necessary

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
  addedToListToken,
  removedFromListToken,
  changedInListToken,
  depositToken,
  redeemToken,
}

