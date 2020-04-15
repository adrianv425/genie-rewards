const router = require('express').Router()
const mongoose = require('mongoose')
const GameAddress = mongoose.model('GameAddress')
const Game = mongoose.model('Game')
const auth = require('@routes/auth')
const { fromWei, toWei } = require('web3-utils')
const { getBalance, invest, getCurrentPrize, getPrivate } = require('@services/funding')

//Search for game with game address
//GET request
//{ 'gameAddress' : gameAddress }
router.get('/', auth.required, async (req, res, next) => {
  const gameAddressString = req.body.gameAddress
  const gameAddress = await GameAddress.findOne({ gameAddress: gameAddressString })
  return res.json({ data: gameAddress })
})

//Ask for balance of available funds in game address
//GET request
//{ 'gameAddress' : gameAddress }
router.get('/balance', auth.required, async (req, res, next) => {
  const gameAddress = req.body.gameAddress
  const available = fromWei(await getBalance(gameAddress))
  const { fund } = await Game.findOne({ gameAddress: gameAddress })
  const currentPrize = fromWei(await getCurrentPrize(gameAddress))
  return res.json({ data: { balance: { available, fund: fromWei(fund), currentPrize } } })
})

//Invest available funds with game address
//POST request
//{ 'gameAddress' : gameAddress,
//  'balance' : howMuchYouWantToInvest  }
router.post('/invest', auth.required, async (req, res) => {
  const gameAddress = req.body.gameAddress
  try{
    if (req.body.balance) {
    invest(gameAddress, toWei(String(req.body.balance)))
  } else {
    const balance = await getBalance(gameAddress)
    invest(gameAddress, balance)
  }
  res.json({ status: 'Successfully invested '})
}catch(err){
 res.json({status: 'Invest Unsuccessful'})
}
})

module.exports = router
