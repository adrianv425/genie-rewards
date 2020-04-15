const mongoose = require('mongoose')
const { Schema } = mongoose

const GameAddressSchema = new Schema({
  address: { type: String, required: [true, "can't be blank"] },
  childIndex: { type: Number, required: [true, "can't be blank"] },
  private: { type: String, required: [true, "can't be blank"] },
  nonce: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockingTime: { type: Date }
}, { timestamps: true })

GameAddressSchema.index({ address: 1 }, { unique: true })

const GameAddress = mongoose.model('GameAddress', GameAddressSchema)

module.exports = GameAddress
