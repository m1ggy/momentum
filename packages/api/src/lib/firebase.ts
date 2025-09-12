import {
  applicationDefault,
  cert,
  initializeApp,
  type App,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app: App;

if (process.env.GOOGLE_CREDENTIALS_B64) {
  console.log('Using Base64 google creds...');
  // Decode the base64 env and parse JSON
  const json = Buffer.from(
    process.env.GOOGLE_CREDENTIALS_B64,
    'base64',
  ).toString('utf8');
  const serviceAccount = JSON.parse(json);

  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  // fallback: uses GOOGLE_APPLICATION_CREDENTIALS env var pointing to a JSON file
  app = initializeApp({
    credential: applicationDefault(),
  });
}

export const auth = getAuth(app);
export default app;
