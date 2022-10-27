import { Router } from '../deps.ts';
import {
  loginUserController,
  logoutController,
  signUpUserController,
} from '../controllers/auth.ts';
import { createUserSchema, loginUserSchema } from '../schema/user.ts';
import validate from '../middlewares/validate.ts';
import protectedRoute from '../middlewares/protected.ts';

const router = new Router();

router.post<string>(
  '/register',
  validate(createUserSchema),
  signUpUserController
);

router.post<string>('/login', validate(loginUserSchema), loginUserController);

router.get<string>('/logout', protectedRoute, logoutController);

export default router;
