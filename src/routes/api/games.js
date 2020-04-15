const router = require('express').Router()
const mongoose = require('mongoose')
const Game = mongoose.model('Game')
const { createGameAddress } = require('@services/gameAddress')

/**
 * @api {get} /games/:gameId Retrieve game
 * @apiName GetGame
 * @apiGroup Game
 * @apiDescription Retrieves game object
 *
* @apiParam {String} gameId Game's id
 *
**/
router.get('/:gameId', async (req, res, next) => {
  const { gameId } = req.params
  const game = await Game.findById(gameId)
  return res.json({ data: game })
})

/**
 * @api {post} /games/ Create new game
 * @apiName CreateGame
 * @apiGroup Game
 * @apiDescription Creates new game with a funding
 *
 * @apiParam {String} name Game's name
 *
 *  @apiParamExample {json} Request-Example:
 *  {
 *      "name": "My game",
 *  }
 *
**/
router.post('/', async (req, res, next) => {
  const { name } = req.body
  const gameAddress = await createGameAddress()
  const game = await new Game({ name, gameAddress: gameAddress.address }).save()
  console.log("Created Game : " + game.toString())
  return res.json({ response: "Created " + game.toString() })
})

module.exports = router
