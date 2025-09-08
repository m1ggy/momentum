import fastifyAutoload from '@fastify/autoload';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = Fastify({ logger: true });

const here = dirname(fileURLToPath(import.meta.url));

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyAutoload, {
  dir: join(here, 'routes'),
  dirNameRoutePrefix: true,
});

const PORT = parseInt(process.env.PORT as string);
const port = !isNaN(PORT) ? PORT : 3000;

app.listen({ port, host: '0.0.0.0' });
