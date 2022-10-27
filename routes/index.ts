import { Application } from '../deps.ts';
import taskRouter from './task.ts';
import authRouter from './auth.ts';
import userRouter from './user.ts';

// 透過該函式統一將所有的 Router 進行初始化，同時也較易於管理
function init(app: Application) {
  // 使用前綴為 /api/v1/...
  app.use(taskRouter.prefix('/api/v1/tasks').routes());
  app.use(authRouter.prefix('/api/v1/auth').routes());
  app.use(userRouter.prefix('/api/v1/users').routes());
}

export default {
  init,
};
