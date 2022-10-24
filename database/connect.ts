import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

const client = new MongoClient();
const URI = 'mongodb://127.0.0.1:27017';
await client.connect(URI);
console.log('Database connected!');
const database = client.database('deno-db');
export default database;
