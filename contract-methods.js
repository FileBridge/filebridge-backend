const BRIDGE_WALLET = process.env.BRIDGE_WALLET
const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS
const DESTINATION_TOKEN_CONTRACT_ADDRESS = process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS
const ORIGIN_EXPLORER = process.env.ORIGIN_EXPLORER
const DESTINATION_EXPLORER = process.env.DESTINATION_EXPLORER

const depositToken = async (provider, contract, to, chainId, token, amount) => {
  try {
    const receipt = await contract.methods.deposit(to, chainId, token, amount)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `depositTokens > You can see this transaction in ${process.env.ORIGIN_EXPLORER}${receipt.transactionHash}`
    )
  } catch (error) {
    console.error('Error in deposit >', error)
    return false
  }
}
const redeemToken = async (provider, contract, to, chainId, token, amount)=> {
  try {
    const receipt = await contract.methods.redeem(to, chainId, token, amount)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const withdrawToken = async (provider, contract, to, token, amount, fee, kappa)=> {
  try {
    const receipt = await contract.methods.withdraw(to, token, amount, fee, kappa)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const mintToken = async (provider, contract, to, token, amount, fee, kappa)=> {
  try {
    const receipt = await contract.methods.mint(to, token, amount, fee, kappa)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const depositAndSwapToken = async (provider, contract, to, chainId, token, amount, tokenIndexFrom, tokenIndexTo, minDy, deadline)=> {
  try {
    const receipt = await contract.methods.depositAndSwap(to, chainId, token, amount, tokenIndexFrom, tokenIndexTo, minDy, deadline)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const mintAndSwapToken = async (provider, contract, to, token, amount, fee, pool, tokenIndexFrom, tokenIndexTo, minDy, deadline, kappa)=> {
  try {
    const receipt = await contract.methods.mintAndSwap(to, token, amount, fee, pool, tokenIndexFrom, tokenIndexTo, minDy, deadline, kappa)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}
const redeemAndSwapToken = async (provider, contract, to, chainId, token, amount, tokenIndexFrom, tokenIndexTo, minDy, deadline)=> {
  try {
    const receipt = await contract.methods.redeemAndSwap(to, chainId, token, amount, tokenIndexFrom, tokenIndexTo, minDy, deadline)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}

const removeAndRedeemToken = async (provider, contract, to, chainId, token, amount, swapTokenIndex, swapMinAmount, swapDeadline)=> {
  try {
    const receipt = await contract.methods.redeemAndRemove(to, chainId, token, amount, swapTokenIndex, swapMinAmount, swapDeadline)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}

const removeAndWithdrawToken = async (provider, contract, to, token, amount, fee, pool, swapTokenIndex, swapMinAmount, swapDeadline, kappa)=> {
  try {
    const receipt = await contract.methods.withdrawAndRemove(to, token, amount, fee, pool, swapTokenIndex, swapMinAmount, swapDeadline, kappa)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `redeemTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`)
  } catch (error) {
    console.error('Error in redeem >', error)
    return false
  }
}

const v2RedeemToken = async (provider, contract, to, chainId, token, amount)=> {
  try {
    const receipt = await contract.methods.redeemV2(to, chainId, token, amount)
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
  redeemToken,
  withdrawToken,
  mintToken,
  depositAndSwapToken,
  mintAndSwapToken,
  redeemAndSwapToken,
  removeAndRedeemToken,
  removeAndWithdrawToken,
  v2RedeemToken,
}
