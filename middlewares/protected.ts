import { User } from '../models/user.ts';
import { Bson, Status } from '../deps.ts';
import type { Context } from '../deps.ts';
import { verifyJwt } from '../utils/jwt.ts';
import config from '../config/default.ts';

const protectedRoute = async (ctx: Context, next: () => Promise<unknown>) => {
  try {
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get('Authorization');
    const cookieToken = await ctx.cookies.get('token');
    let token;

    // 判斷是否有 token 在 http header 中的 authorization
    // 或是否在 cookie 中
    if (authorization) {
      token = authorization.split(' ')[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    // 判斷 token 是否存在
    if (!token) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = {
        status: 'fail',
        message: 'You are not logged in',
      };
      return;
    }

    // 驗證 JWT token 及確認用戶是否存在
    const decoded = await verifyJwt(token, config.jwtSecret);
    const userExists = await User.findOne({
      _id: new Bson.ObjectId(decoded.sub),
    });

    if (!userExists) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = {
        status: 'fail',
        message: 'The user belonging to this token no longer exists',
      };
      return;
    }

    // 將 userId 存至 state 中傳遞給下個 middleware
    ctx.state['userId'] = userExists._id;
    await next();
    delete ctx.state.userId;
  } catch (error) {
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = {
      status: 'error',
      message: error.message,
    };
  }
};

export default protectedRoute;
