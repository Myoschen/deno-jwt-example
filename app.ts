import { Application, Router, oakCors } from './deps.ts';
import config from './config/default.ts';
import logger from './middlewares/logger.ts';
import appRouter from './routes/index.ts';

// 創建一個 oak instance
const app = new Application();

// 使用 middleware
app.use(logger);

// 加入 CORS middleware
app.use(
  oakCors({
    origin: /^.+localhost:(3000|3001)$/,
    optionsSuccessStatus: 200,
  })
);

// 初始化路由
appRouter.init(app);

app.addEventListener('listen', ({ port, secure }) => {
  // secure 用來判斷是 http 還是 https
  console.log(
    `🚀 Server started on ${secure ? 'https://' : 'http://'}localhost:${port}`
  );
});

// 監聽指定的 Port
await app.listen({ port: config.port });
