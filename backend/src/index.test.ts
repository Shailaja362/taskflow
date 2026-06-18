import request from 'supertest';
import { app } from './index';

// These tests run without a DB connection — they validate routing,
// middleware, and input-validation logic (fast CI quality gate).
describe('API basics', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('rejects task access without a token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('rejects register with a bad email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'secret123' });
    expect(res.status).toBe(400);
  });
});
