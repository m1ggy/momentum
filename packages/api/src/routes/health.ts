import { type FastifyPluginAsync } from 'fastify';
import { type ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const routes: FastifyPluginAsync = async (app) => {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    '/health',
    {
      schema: {
        response: {
          200: z.object({ ok: z.boolean() }),
        },
      },
    },
    async () => ({ ok: true }),
  );
};

export default routes;
