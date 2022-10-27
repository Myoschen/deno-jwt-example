import { Router } from '../deps.ts';
import { getMeController } from '../controllers/user.ts';
import protectedRoute from '../middlewares/protected.ts';

const router = new Router();

router.get<string>('/me', protectedRoute, getMeController);

export default router;
