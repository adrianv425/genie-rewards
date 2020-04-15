module.exports = {
  api: {
    allowCors: true,
    secret: API_SECRET,
    secretOptions: {
      expiresIn: '30d'
    },
    port: 3000
  },
  mongo: {
    debug: true,
    uri: DATABASE_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      reconnectTries: 30, // Retry up to 30 times
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
    }
  },
  mail: {
    sendgrid: {
      templates: {}
    }
  },
  secrets: {
    accounts: {
      mnemonic: NMEMONIC_PHRASE
    }
  },
  network: {
    name: 'kovan',
    provider: NETWORK_PROVIDER,
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
