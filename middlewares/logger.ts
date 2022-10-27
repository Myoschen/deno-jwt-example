import type { Context } from '../deps.ts';

type MiddlewareBase = (ctx: Context, next: () => Promise<unknown>) => void;

const logger: MiddlewareBase = async (ctx, next) => {
  // 取得 Request 當下的時間
  const start = Date.now();

  // 跳至下個 middleware
  await next();

  // 從接收 Request 到發送 Response 總共花費的時間
  const ms = Date.now() - start;

  // 設置 X-Response-Time
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
};

export default logger;
