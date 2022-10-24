import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
import { create } from 'https://deno.land/x/djwt@v2.7/mod.ts';
import database from '../database/connect.ts';
import { UserSchema } from '../schema/user.ts';
import { key } from '../utils/apiKey.ts';

const Users = database.collection<UserSchema>('users');

export const signup = async (username: string, password: string) => {
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);
  const _id = Users.insertOne({
    username,
    password: hashedPassword,
  });
  return _id;
};

export const signin = async (username: string, password: string) => {
  const user = await Users.findOne({ username });

  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  const confirmPassword = await bcrypt.compare(password, user.password);
  if (!confirmPassword) {
    throw new Error('Incorrect password');
  }

  const payload = {
    id: user._id,
    name: username,
  };
  const jwt = await create({ alg: 'HS512', typ: 'JWT' }, { payload }, key);
  if (jwt) {
    return {
      userId: user._id,
      username: user.username,
      token: jwt,
    };
  } else {
    throw new Error('Internal server error');
  }
};
