import { Controller, Get } from '@midwayjs/core';

@Controller('/cgi/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
