var router = require('express').Router()
const { generateToken } = require('@utils/jwt')

router.use('/api/v1', require('./api'))

router.get('/is_running', (req, res, next) => {
  res.send({ response: 'ok' })
})

/**
 * @api {get} /games/getJWT Request a jwt (WE NEED A BETTER SOLUTION WHEN PRODUTION COMES)
 * @apiName GetJWT
 * @apiGroup JWT Token
 * @apiDescription returns the JWT to access the other api endpoints
 *
 * @apiParam {String} game ID
 * *  @apiParamExample {json} Request-Example:
 *  {
 *      "gameAddress": gameAddress,
 *  }
 *
 *
**/
router.get('/getJWT', async (req,res,next)=>{
  const gameAddress = "newToken"

  console.log(gameAddress)
  const jwtToken = await generateToken(gameAddress)
  return res.json({
    response: jwtToken
  })
})

module.exports = router
