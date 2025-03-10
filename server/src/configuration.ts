import { Configuration, App, MidwayInformationService } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
// import { MidwayInfoService } from '@midwayjs/info';
import * as mongoose from '@midwayjs/mongoose';
import * as jwt from '@midwayjs/jwt';
import * as crossDomain from '@midwayjs/cross-domain';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import { JwtMiddleware } from './middleware/jwt.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    mongoose,
    jwt,
    crossDomain,
    {
      component: MidwayInformationService,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, JwtMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
