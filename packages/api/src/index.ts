// app.ts (your current entry)
import fastifyAutoload from '@fastify/autoload';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import firebaseApp from './lib/firebase.js';

import authPlugin from './plugins/auth.js';

dotenv.config({ debug: true });

const app = Fastify({ logger: true });
const here = dirname(fileURLToPath(import.meta.url));

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(authPlugin, {
  requireAuthByDefault: true,
  checkRevoked: false,
});

await app.register(fastifyAutoload, {
  dir: join(here, 'routes'),
  dirNameRoutePrefix: true,
});

const PORT = Number(process.env.PORT) || 3000;
app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  app.log.info('Server started');
  console.log('Firebase App Name: ', firebaseApp.name);
});
