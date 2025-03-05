import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1640826752615_6346',
  koa: {
    port: 7001,
  },
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  jwt: {
    secret: 'your-jwt-secret-key',
    expiresIn: '2d',
  },
  security: {
    csrf: false,
  },
} as MidwayConfig;