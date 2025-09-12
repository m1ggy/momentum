// plugins/pg.ts
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import {
  Pool,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from 'pg';

export type PgPluginOptions = {
  connectionString?: string;
  poolOptions?: Omit<ConstructorParameters<typeof Pool>[0], 'connectionString'>;
  ssl?: boolean | { rejectUnauthorized?: boolean };
};

declare module 'fastify' {
  interface FastifyInstance {
    pg: {
      pool: Pool;
      query: <R extends QueryResultRow = QueryResultRow>(
        text: string,
        params?: ReadonlyArray<unknown>,
      ) => Promise<QueryResult<R>>;
    };
    withTransaction: <T>(fn: (client: PoolClient) => Promise<T>) => Promise<T>;
  }
}

const pgPlugin: FastifyPluginAsync<PgPluginOptions> = async (fastify, opts) => {
  const pool = new Pool({
    connectionString: opts.connectionString || process.env.DATABASE_URL,
    ssl:
      opts.ssl ??
      (process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined),
    ...opts.poolOptions,
    options: '-c search_path=momentum,public',
  });
  await pool.query('SELECT 1');

  fastify.decorate('pg', {
    pool,
    // Cast params to any[] only at the call-site to satisfy pg's signature (values?: any[])
    query: <R extends QueryResultRow = QueryResultRow>(
      text: string,
      params?: ReadonlyArray<unknown>,
    ) => pool.query<R>(text, params as any[]),
  });

  fastify.decorate(
    'withTransaction',
    async <T>(fn: (client: PoolClient) => Promise<T>) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        try {
          await client.query('ROLLBACK');
        } catch {
          // make eslint happy
        }
        throw err;
      } finally {
        client.release();
      }
    },
  );

  fastify.addHook('onClose', async () => {
    await pool.end();
  });

  console.log('PG Connected');
};

export default fp(pgPlugin, { name: 'pg' });
