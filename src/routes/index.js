var router = require('express').Router()
var { generateToken } = require('@utils/jwt');
var config = require('config');

router.use('/api/v1', require('./api'))

router.get('/is_running', (req, res, next) => {
  res.send({ response: 'ok',
    token: generateToken(config.get('network.addresses.DaiToken'))
  })
})

module.exports = router
