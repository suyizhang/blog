import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';

@Middleware()
export class JwtMiddleware {
  public static getName(): string {
    return 'jwt';
  }

  public async resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 跳过登录和注册接口的JWT验证
      if (ctx.path === '/api/user/login' || ctx.path === '/api/user/register') {
        return await next();
      }

      const token = ctx.get('Authorization')?.split(' ')[1];
      if (!token) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '未登录' };
        return;
      }

      try {
        const decoded = jwt.verify(token, ctx.app.getConfig('jwt').secret);
        ctx.state.user = decoded;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '登录已过期' };
      }
    };
  }
}