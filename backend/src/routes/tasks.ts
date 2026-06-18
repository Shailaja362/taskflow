import { Router, Response } from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const VALID_STATUS = ['todo', 'in_progress', 'done'];

router.use(requireAuth);

// List all tasks for the logged-in user
router.get('/', async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId]
  );
  res.json(result.rows);
});

// Create a task
router.post('/', async (req: AuthRequest, res: Response) => {
   const { title, description = '', status = 'todo' } = req.body || {};
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title required' });
  if (!VALID_STATUS.includes(status)) return res.status(400).json({ error: 'invalid status' });
  const result = await pool.query(
    'INSERT INTO tasks (user_id, title, description, status) VALUES ($1,$2,$3,$4) RETURNING *',
    [req.userId, title, description, status]
  );
  res.status(201).json(result.rows[0]);
});

// Update a task
router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { title, description, status } = req.body || {};
  if (status && !VALID_STATUS.includes(status)) return res.status(400).json({ error: 'invalid status' });
  const result = await pool.query(
    `UPDATE tasks SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       status = COALESCE($3, status),
       updated_at = NOW()
     WHERE id = $4 AND user_id = $5 RETURNING *`,
    [title, description, status, req.params.id, req.userId]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
  res.json(result.rows[0]);
});

// Delete a task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
    [req.params.id, req.userId]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

export default router;
