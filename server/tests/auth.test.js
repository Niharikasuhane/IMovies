const request = require('supertest');
const db = require('./setup');
const app = require('../src/app');
const User = require('../src/models/User');

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const user = { name: 'Test', email: 'test@x.com', password: 'secret1' };

describe('Authentication', () => {
  test('registers a user and hashes password', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    const db_user = await User.findOne({ email: user.email }).select('+password');
    expect(db_user.password).not.toBe(user.password);
  });

  test('ignores role escalation on register', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...user, role: 'admin' });
    expect(res.body.user.role).toBe('user');
  });

  test('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  test('validates input', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad', password: '1' });
    expect(res.status).toBe(400);
  });

  test('login success / wrong password', async () => {
    await request(app).post('/api/auth/register').send(user);
    expect((await request(app).post('/api/auth/login').send(user)).status).toBe(200);
    expect((await request(app).post('/api/auth/login').send({ ...user, password: 'wrong!!' })).status).toBe(401);
  });

  test('protected route needs token; admin route blocks normal users', async () => {
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
    const { body } = await request(app).post('/api/auth/register').send(user);
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${body.token}`);
    expect(res.status).toBe(403);
  });
});
