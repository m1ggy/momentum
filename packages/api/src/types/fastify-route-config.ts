// types/fastify-route-config.d.ts
import 'fastify';

declare module 'fastify' {
  // This is the type of `routeOptions.config`
  interface FastifyContextConfig {
    public?: boolean;
  }
}
