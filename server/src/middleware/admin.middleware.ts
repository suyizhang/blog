import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';

@Middleware()
export class AdminMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 检查用户是否已登录
      const user = ctx.state.user;
      if (!user) {
        throw new httpError.UnauthorizedError('未登录');
      }

      // 检查用户是否是管理员
      if (!user.isAdmin) {
        throw new httpError.ForbiddenError('无管理员权限');
      }

      await next();
    };
  }

  static getName(): string {
    return 'admin';
  }

  match(ctx: Context): boolean {
    return ctx.path.startsWith('/admin');
  }
}