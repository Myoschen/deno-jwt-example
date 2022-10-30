import { dotenvConfig } from '../deps.ts';

// export 設置 true 會將所有在 .env 檔的環境變數引入至當前的 process 中
// 所有環境變數就可以透過 Deno.env.get(<key>) 取得
dotenvConfig({ export: true });

// https://stackoverflow.com/questions/69399211/typescript-why-does-as-unknown-as-x-work
const config = {
  api: {
    base: Deno.env.get('BASE_URL') as unknown as string,
    version: Deno.env.get('API_VERSION') as unknown as string,
    port: parseInt(Deno.env.get('PORT') as unknown as string),
  },
  mongo: {
    uri: Deno.env.get('MONGODB_URI') as unknown as string,
    database: Deno.env.get('MONGODB_DATABASE_NAME') as unknown as string,
  },
  jwt: {
    secret: Deno.env.get('JWT_SECRET') as unknown as string,
    expiresIn: parseInt(Deno.env.get('JWT_EXPIRES_IN') as unknown as string),
  },
};

export default config;
