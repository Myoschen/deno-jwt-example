import { verify } from 'https://deno.land/x/djwt@v2.7/mod.ts';
import { key } from '../utils/apiKey.ts';
import { Context, Status } from 'https://deno.land/x/oak@v11.1.0/mod.ts';

export const authorized = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  try {
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get('Authorization');
    if (!authorization) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const jwt = authorization.split(' ')[1];
    if (!jwt) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const payload = await verify(jwt, key);
    if (!payload) {
      throw new Error('!payload');
    }
    await next();
  } catch (_error) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = {
      message: 'You are not authorized to access this route',
    };
    return;
  }
};
