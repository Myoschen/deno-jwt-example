import { Application } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import router from './routes/allRoutes.ts';

const app = new Application();
const PORT = 3000;

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Application is listening on port: ${PORT}`);

await app.listen({ port: PORT });
