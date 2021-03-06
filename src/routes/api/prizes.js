const router = require('express').Router()
const mongoose = require('mongoose')
const { fromWei } = require('web3-utils')
const Prize = mongoose.model('Prize')
const Game = mongoose.model('Game')
const auth = require('@routes/auth')
const { getCurrentPrize, redeemPrize } = require('@services/funding')

/**
 * @api {post} /prizes Create new prize
 * @apiName CreatePrize
 * @apiGroup Prize
 * @apiDescription Creates new prize, but doesn't send it to the winner yet
 *
 * @apiParam {String} winnerId external id of the winner, used to identify the user
 *
 * @apiHeader {String} Authorization JSON Web Token in the format "Bearer {jwtToken}"
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *      "winnerId": "player123",
 *  }
**/
router.post('/', auth.required, async (req, res) => {
  const { gameAddress } = req.body
  const { winnerId } = req.body
  const nextPrize = await getCurrentPrize(gameAddress)
  const game = await Game.findOne({ gameAddress: gameAddress })
  const prize = await new Prize({
    amount: nextPrize,
    game,
    winnerId
  }).save()

  res.json({
    data: { ...prize.toJSON(), amount: fromWei(prize.amount) }
  })
})

/**
 * @api {post} /prizes/claim Claim  prize
 * @apiName ClaimPrize
 * @apiGroup Prize
 * @apiDescription Claimes an existing prize and sends it to the user
 *
 * @apiParam {String} winnerId external id of the winner, used to identify the prize
 * @apiParam {String} winnerAccountAddress Ethereum account address of the winner, the prize will be send to this address
 *
 * @apiHeader {String} Authorization JSON Web Token in the format "Bearer {jwtToken}"
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *      "winnerId": "player123",
 *      "winnerAccountAddress": "0x123"
 *  }
**/
router.post('/claim', auth.required, async (req, res) => {
  const { gameAddress } = req.body
  const { winnerId, winnerAccountAddress } = req.body

  const game = await Game.findOne({ gameAddress })
  const prizes = await Prize.find({ winnerId, game: game._id, redeemed: false })
  for (let prize of prizes) {
    prize.winnerAccountAddress = winnerAccountAddress
    redeemPrize(gameAddress, prize)
  }

  res.json({
    data: prizes
  })
})

/**
 * @api {get} /prizes/currentPrize Retrieve next prize
 * @apiName GetCurrentPrize
 * @apiGroup Prize
 * @apiDescription  Retrieves next prize for the game
 *
**/
router.get('/currentPrize', auth.required, async (req, res, next) => {
  const { accountAddress } = req.user
  const nextPrize = fromWei(await getCurrentPrize(accountAddress))
  return res.json({ data: nextPrize })
})

module.exports = router
