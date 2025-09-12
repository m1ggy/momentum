import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp();
export const auth = getAuth(app);

export default app;
