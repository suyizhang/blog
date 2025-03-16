import { MidwayConfig } from '@midwayjs/core';

export default {
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://localhost:27017/trae_blog',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 30000,
          connectTimeoutMS: 30000,
          maxPoolSize: 10
        },
      },
    },
  },
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '2d',
  },
} as MidwayConfig;
