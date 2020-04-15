const config = require('config')
const DaiAbi = require('@assets/abi/dai')
const CDaiAbi = require('@assets/abi/cDai')
const mongoose = require('mongoose')
const BigNumber = require('bignumber.js')
const { web3 } = require('@services/web3')
const { fromWei, toWei } = require('web3-utils')
const { createNetwork , getPrivateKey } = require('@utils/web3')

const Game = mongoose.model('Game')
const GameAddress = mongoose.model('GameAddress')

const daiToken = new web3.eth.Contract(DaiAbi, config.get('network.addresses.DaiToken'))
const cDaiToken = new web3.eth.Contract(CDaiAbi, config.get('network.addresses.CDaiToken'))

const getBalance = (accountAddress) => {
  return daiToken.methods.balanceOf(accountAddress).call()
}

const getPrivate = (account) => {
  return getPrivateKey(account)
}

const getInvestedBalance = (accountAddress) => {
  return cDaiToken.methods.balanceOfUnderlying(accountAddress).call()
}

const getCurrentPrize = async (accountAddress) => {
  const { fund } = await Game.findOne({ gameAddress : accountAddress })
  const investedBalance = await getInvestedBalance(accountAddress)
  return new BigNumber(investedBalance).minus(fund).toString()
}

//Lock up Dai to gain interest
const invest = async (accountAddress, balance) => {
  const account = await GameAddress.findOne({ address: accountAddress })
  const { createContract, send, createMethod } = createNetwork(account)
  const cDaiTokenWithSigner = createContract(CDaiAbi, config.get('network.addresses.CDaiToken'))
  const method = createMethod(cDaiTokenWithSigner, 'mint', balance)

  const receipt = await send(method, {
    from: account.address
  })
  console.log({ receipt })
  if (receipt) {
    console.log('Investing was successful')
    const game = await Game.findOne({ gameAddress: account.address })
    game.fund = new BigNumber(game.fund).plus(balance).toString()
    await game.save()
  } else {
    console.log('Investing failed')
  }
}

//Unlock Dai
const unlockFunds = async (gameAddress, prize) => {
  const account = await GameAddress.findOne({ address: gameAddress })
  console.log(account)
  const { createContract, send, createMethod } = createNetwork(account)
  const iBalance = await getInvestedBalance(gameAddress)
  const cDaiTokenWithSigner = createContract(CDaiAbi, config.get('network.addresses.CDaiToken'))
  const method = createMethod(cDaiTokenWithSigner, 'redeemUnderlying',  iBalance)

  const receipt = await send(method, {
    from: account.address
  })

  if (!receipt) {
    throw new Error('Could not redeem prize')
  }

  //Send profits to winner
  const daiTokenWithSigner = createContract(DaiAbi, config.get('network.addresses.DaiToken'))
  try{const transferMethod = createMethod(daiTokenWithSigner, 'transfer', prize.winnerAccountAddress, prize.amount)

  const transferReceipt = await send(transferMethod, {
    from: account.address
  })

  if (transferReceipt) {
    prize.redeemed = true
    prize.save()
  } else {
    console.log('transfered prize failed')
  }}catch(err){
    throw new Error(err.toString())
  }
}

const transferToWinner = async (accountAddress, prize) => {
  const account = await Account.findOne({ address: accountAddress })
  const { createContract, send, createMethod } = createNetwork(account)
  const daiTokenWithSigner = createContract(DaiAbi, config.get('network.addresses.DaiToken'))
  const transferMethod = createMethod(daiTokenWithSigner, 'transfer', prize.winnerAccountAddress, prize.amount)

  const transferReceipt = await send(transferMethod, {
    from: account.address
  })

  if (transferReceipt) {
    prize.redeemed = true
    prize.save()
  } else {
    console.log('transfered prize failed')
  }
}

module.exports = {
  getBalance,
  getInvestedBalance,
  getCurrentPrize,
  invest,
  redeemPrize: unlockFunds,
  getPrivate,
  transferToWinner,
}
