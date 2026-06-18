import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initSchema } from './db';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health endpoint used by Docker, ALB, and CI smoke tests
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = Number(process.env.PORT) || 4000;

// Only start listening when run directly (not when imported by tests)
if (require.main === module) {
  initSchema()
    .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
    .catch((err) => {
      console.error('Failed to init schema', err);
      process.exit(1);
    });
}
