import { MongoClient } from '../deps.ts';
import config from '../config/default.ts';

// 建立 MongoDB Client instance
const client: MongoClient = new MongoClient();
await client.connect(config.databaseUri);

console.log('🚀 Connected to MongoDB Successfully');

// 連接至指定的 database
const database = client.database(config.databaseName);

export default database;
