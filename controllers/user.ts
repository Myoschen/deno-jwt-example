import type { RouterContext } from '../deps.ts';
import { Status } from '../deps.ts';
import { User } from '../models/user.ts';
import omitFields from '../utils/omitfields.ts';

// TODO
const getMeController = async ({ state, response }: RouterContext<string>) => {
  try {
    const user = await User.findOne({ _id: state.userId });

    if (!user) {
      response.status = Status.Unauthorized;
      response.body = {
        status: 'fail',
        message: 'The user belonging to this token no longer exists',
      };
    }

    response.status = Status.OK;
    response.body = {
      status: 'success',
      data: {
        user: omitFields(user, 'password', 'verified'),
      },
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

export { getMeController };
