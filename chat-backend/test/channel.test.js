// test/channel.test.js
const request = require('supertest');
const app = require('../server');

describe('Channel Routes', () => {
  let testGroup;

  beforeAll(async () => {
    const adminUser = await request(app)
      .post('/auth/register')
      .send({ username: 'channelAdmin', email: 'channelAdmin@example.com', password: 'password' });
    
    const response = await request(app)
      .post('/groups/create')
      .send({ groupName: 'Group for Channels', adminId: adminUser.body.user._id });
    testGroup = response.body.group;
  });

  it('should create a new channel in a group', async () => {
    const response = await request(app)
      .post(`/channel/${testGroup._id}/channels`)
      .send({ channelName: 'New Channel' });

    expect(response.statusCode).toBe(200);
    expect(response.body.channel).toHaveProperty('name', 'New Channel');
  });

  it('should fetch all channels for a group', async () => {
    const response = await request(app).get(`/channel/${testGroup._id}/channels`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
