import { MidwayConfig } from '@midwayjs/core';

export default {
  mongoose: {
    client: {
      uri: 'mongodb://127.0.0.1:27017/trae',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 20,
        minPoolSize: 5,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
        serverSelectionTimeoutMS: 15000,
        heartbeatFrequencyMS: 10000,
        retryReads: true,
        maxConnecting: 2,
        retryWrites: true,
        writeConcern: {
          w: 'majority',
          wtimeout: 2500
        },
        readPreference: 'primary',
        readConcern: { level: 'local' },
      },
    },
  },
} as MidwayConfig;