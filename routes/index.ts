import { Application, Router } from '../deps.ts';
import config from '../config/default.ts';
import taskRouter from './task.ts';
import authRouter from './auth.ts';
import userRouter from './user.ts';

const version = config.apiVersion;

type RouterInfo = {
  prefix: string;
  // deno-lint-ignore no-explicit-any
  router: Router<Record<string, any>>;
};

const Routers: RouterInfo[] = [
  { prefix: 'tasks', router: taskRouter },
  { prefix: 'auth', router: authRouter },
  { prefix: 'users', router: userRouter },
];

// 透過該函式統一將所有的 Router 進行初始化，同時也較易於管理
function init(app: Application) {
  // 使用前綴為 /api/v1/...
  for (const { prefix, router } of Routers) {
    app.use(router.prefix(`/api/${version}/${prefix}`).routes());
    app.use(router.allowedMethods());
  }
}

export default {
  init,
};
