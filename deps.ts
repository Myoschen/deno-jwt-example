// Deno 不像 Node.js 具有 package.json 來管理所有依賴的套件
// 因此可以透過 TypeScript 及 ESModule 的語法來實現管理套件

// oak: This middleware framework contains tools for building APIs with Deno.
// 就像 Node.js 的 Koa 套件
export {
  Application,
  helpers,
  Router,
  Status,
} from 'https://deno.land/x/oak@v11.1.0/mod.ts';
export type {
  Context,
  RouterContext,
} from 'https://deno.land/x/oak@v11.1.0/mod.ts';

// dotenv: This package will allow us to load the environment variables from any file.
// 管理環境變數
export { config as dotenvConfig } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';

// zod: A TypeScript-first schema validation library that will help us to validate the request bodies.
// 用來對前端發來的資料進行驗證
// 可以至 https://myoschen.github.io/dev/react/zod 了解
export { z } from 'https://deno.land/x/zod@v3.19.1/mod.ts';

// bcrypt: For hashing passwords.
// 用來加密的
export {
  compare,
  genSalt,
  hash,
} from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

// djwt: For creating and verifying JSON Web Tokens in Deno or the browser.
// 創建、驗證 JWT
export {
  create,
  getNumericDate,
  verify,
} from 'https://deno.land/x/djwt@v2.7/mod.ts';
export type { Header, Payload } from 'https://deno.land/x/djwt@v2.7/mod.ts';

// mongo: This is the MongoDB driver for Deno.
// 透過該套件可與 mongodb 進行 CRUD
export {
  Database,
  MongoClient,
  Bson,
  ObjectId,
} from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

// cors: This package will be used to configure the Deno server to accept requests from cross-origin domains.
// 解決 CORS(跨域) 問題
export { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
