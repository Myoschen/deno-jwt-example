import { z, RouterContext, helpers, Status } from '../deps.ts';

const validate =
  (schema: z.AnyZodObject) =>
  async (
    ctx: RouterContext<string>,
    next: () => Promise<unknown>
  ): Promise<void> => {
    try {
      // 使用 Schema 驗證 params、query、body
      // helpers.getQuery 取得在 URL 上的 Query string (request.url.searchParams)
      schema.parse({
        params: ctx.params,
        query: helpers.getQuery(ctx),
        body: await ctx.request.body().value,
      });
      await next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        ctx.response.status = Status.BadRequest;
        ctx.response.body = {
          status: 'fail',
          error: err.errors,
        };
        return;
      }
      await next();
    }
  };

export default validate;
