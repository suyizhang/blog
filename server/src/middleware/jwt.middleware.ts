import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';

@Middleware()
export class JwtMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 跳过登录和注册接口的JWT验证
      if (ctx.path === '/auth/login' || ctx.path === '/auth/register') {
        return await next();
      }

      // 获取token
      const token = ctx.get('Authorization')?.replace('Bearer ', '');
      if (!token) {
        throw new httpError.UnauthorizedError('未登录');
      }

      try {
        // 验证token
        const jwtService = await ctx.requestContext.getAsync(JwtService);
        const decoded = await jwtService.verify(token, { complete: true });
        ctx.state.user = (decoded as any).payload;
        return await next();
      } catch (err) {
        throw new httpError.UnauthorizedError('无效的token');
      }
    };
  }

  static getName(): string {
    return 'jwt';
  }

  match(ctx: Context): boolean {
    return ctx.path.startsWith('/auth');
  }
}
