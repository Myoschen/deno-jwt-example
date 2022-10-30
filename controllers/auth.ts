import type { RouterContext } from '../deps.ts';
import { Bson, Status } from '../deps.ts';
import config from '../config/default.ts';
import { User } from '../models/user.ts';
import type { CreateUserInput, LoginUserInput } from '../schema/user.ts';
import { comparePasswords, hashPassword } from '../utils/password.ts';
import omitFields from '../utils/omitfields.ts';
import { signJwt } from '../utils/jwt.ts';

const signUpUserController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const { username, email, password }: CreateUserInput = await request.body()
      .value;

    // 對密碼進行加密
    const hashedPassword = await hashPassword(password);
    const createdAt = new Date();
    const updatedAt = createdAt;

    const userId: string | Bson.ObjectId = await User.insertOne({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      verified: false,
      createdAt,
      updatedAt,
    });

    // 確認是否成功將資料儲存至 database
    if (!userId) {
      response.status = Status.InternalServerError;
      response.body = { status: 'error', message: 'Error creating user' };
      return;
    }

    const user = await User.findOne({ _id: userId });

    response.status = Status.Created;
    response.body = {
      status: 'success',
      data: {
        user: omitFields(user, 'password', 'verified'),
      },
    };
  } catch (error) {
    // 判斷 email 是否是唯一的
    if ((error.message as string).includes('E11000')) {
      response.status = Status.Conflict;
      response.body = {
        status: 'fail',
        message: 'A user with that email already exists',
      };
      return;
    }
    response.status = Status.InternalServerError;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const loginUserController = async ({
  request,
  response,
  cookies,
}: RouterContext<string>) => {
  try {
    const { email, password }: LoginUserInput = await request.body().value;
    const message = 'Invalid email or password';
    const userExists = await User.findOne({ email });

    // 判斷資料是否存在、密碼是否一致
    if (
      !userExists ||
      !(await comparePasswords(password, userExists.password))
    ) {
      response.status = Status.Unauthorized;
      response.body = {
        status: 'fail',
        message,
      };
      return;
    }

    // 創建 JWT token
    const token = await signJwt({
      userId: String(userExists._id),
      expiresIn: config.jwt.expiresIn,
      secretKey: config.jwt.secret,
    });

    // 設置 token 至 cookies
    cookies.set('token', token, {
      expires: new Date(Date.now() + config.jwt.expiresIn * 60 * 1000),
      maxAge: config.jwt.expiresIn * 60,
      httpOnly: true,
      secure: false,
    });

    response.status = Status.OK;
    response.body = { status: 'success', token };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const logoutController = ({ response, cookies }: RouterContext<string>) => {
  // 銷毀 cookies 中的 token
  cookies.set('token', '', {
    httpOnly: true,
    secure: false,
    maxAge: -1,
  });
  response.status = Status.OK;
  response.body = { status: 'success' };
};

export { signUpUserController, loginUserController, logoutController };
