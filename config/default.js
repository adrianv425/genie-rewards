module.exports = {
  api: {
    allowCors: true,
    secret: process.env.API_SECRET,
    secretOptions: {
      expiresIn: '30d'
    },
    port: process.env.PORT
  },
  mongo: {
    debug: true,
    uri: process.env.DATABASE_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  mail: {
    sendgrid: {
      templates: {}
    }
  },
  secrets: {
    accounts: {
      mnemonic: process.env.MNEMONIC_PHRASE
    }
  },
  network: {
    name: 'kovan',
    provider: process.env.NETWORK_PROVIDER,
    addresses: {
      DaiToken: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
      CDaiToken: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c',
      CompoundDai: '0xe7bc397DBd069fC7d0109C0636d06888bb50668c'
    },
    gasStation: 'https://ethgasstation.info/json/ethgasAPI.json',
    contract: {
      options: {
        transactionConfirmationBlocks: 2
      }
    }
  }
}
