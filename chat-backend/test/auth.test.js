// test/auth.test.js
const request = require('supertest');
const app = require('../server'); // Ensure the server file exports the app instance

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user).toHaveProperty('username', 'testuser');
  });

  it('should not register a user with an existing username', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'unique@example.com',
        password: 'testpassword'
      });

    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'another@example.com',
        password: 'testpassword'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Username already exists');
  });

  it('should log in with correct credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toHaveProperty('username', 'testuser');
  });

  it('should not log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
