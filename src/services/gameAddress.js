const mongoose = require('./mongoose')
const GameAddress = mongoose.model('GameAddress')
const { generateAccountAddress } = require('@utils/account')
const { getPrivateKey } = require('@utils/web3')

const createGameAddress = async () => {
  const lastGameAddress = await GameAddress.findOne().sort({ childIndex: -1 })
  console.log({ lastAccount: lastGameAddress })
  const lastChildIndex = (lastGameAddress && lastGameAddress.childIndex) || 0
  const childIndex = lastChildIndex + 1
  const address = generateAccountAddress(childIndex)
  const private = getPrivateKey(address, childIndex)
  const account = await new GameAddress({
    childIndex,
    address,
    private
  }).save()
  return account
}

module.exports = {
  createGameAddress
}
