// test/user.test.js
const request = require('supertest');
const app = require('../server');

describe('User Routes', () => {
  it('should fetch all users', async () => {
    const response = await request(app).get('/user/users');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should fetch a user by ID', async () => {
    const newUser = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser1', email: 'user1@example.com', password: 'password' });
    
    const userId = newUser.body.user._id;

    const response = await request(app).get(`/user/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('testuser1');
  });

  it('should return 404 for a non-existent user', async () => {
    const response = await request(app).get('/user/users/invalidUserId');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
