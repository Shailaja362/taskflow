import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db';
import { signToken } from '../middleware/auth';

const router = Router();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!isValidEmail(email) || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Valid email and password (min 6 chars) required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hash]
    );
    const userId = result.rows[0].id;
    return res.status(201).json({ token: signToken(userId), userId });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const result = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
  if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, result.rows[0].password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const userId = result.rows[0].id;
  return res.json({ token: signToken(userId), userId });
});

export default router;
