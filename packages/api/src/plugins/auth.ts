// plugins/auth.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../lib/firebase.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      uid: string;
      token: DecodedIdToken;
    };
  }
}

type AuthPluginOpts = {
  /** If true, all routes require auth unless { config: { public: true } } is set. Default: true */
  requireAuthByDefault?: boolean;
  /** If true, verify revocation status (slower). Default: false */
  checkRevoked?: boolean;
};

export default fp<AuthPluginOpts>(async (fastify, opts) => {
  const requireAuthByDefault = opts.requireAuthByDefault ?? true;
  const checkRevoked = opts.checkRevoked ?? false;

  fastify.addHook(
    'preHandler',
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Skip auth if route explicitly marked as public
      const isPublic = request.routeOptions?.config?.public === true;
      if (isPublic && requireAuthByDefault) return;

      const header =
        request.headers.authorization || request.headers.Authorization;
      if (!header || Array.isArray(header)) {
        return reply.code(401).send({ error: 'Missing Authorization header' });
      }

      const [scheme, token] = header.split(' ');
      if (!/^Bearer$/i.test(scheme as string) || !token) {
        return reply
          .code(401)
          .send({ error: 'Invalid Authorization header format' });
      }

      try {
        const decoded = await auth.verifyIdToken(token, checkRevoked);
        request.user = { uid: decoded.uid, token: decoded };
      } catch (err) {
        request.log.warn({ err }, 'Auth token verification failed');
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    },
  );
});
