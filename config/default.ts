import { dotenvConfig } from '../deps.ts';

// export 設置 true 會將所有在 .env 檔的環境變數引入至當前的 process 中
// 所有環境變數就可以透過 Deno.env.get(<key>) 取得
dotenvConfig({ export: true });

type ConfigOption = {
  port: number;
  databaseUri: string;
  databaseName: string;
  jwtSecret: string;
  jwtExpiresIn: number;
  apiVersion: string;
};

// https://stackoverflow.com/questions/69399211/typescript-why-does-as-unknown-as-x-work
const config: ConfigOption = {
  port: parseInt(Deno.env.get('PORT') as unknown as string),
  databaseUri: Deno.env.get('MONGODB_URI') as unknown as string,
  databaseName: Deno.env.get('MONGODB_DATABASE') as unknown as string,
  jwtSecret: Deno.env.get('JWT_SECRET') as unknown as string,
  jwtExpiresIn: 30,
  apiVersion: Deno.env.get('API_VERSION') as unknown as string,
};

export default config;
