// test/group.test.js
const request = require('supertest');
const app = require('../server');

describe('Group Routes', () => {
  let adminUser;

  beforeAll(async () => {
    // Create a user to act as admin
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'admin', email: 'admin@example.com', password: 'adminpassword' });
    adminUser = response.body.user;
  });

  it('should create a new group', async () => {
    const response = await request(app)
      .post('/groups/create')
      .send({
        groupName: 'Test Group',
        adminId: adminUser._id
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.group).toHaveProperty('name', 'Test Group');
  });

  it('should fetch all groups', async () => {
    const response = await request(app).get('/groups');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should fetch a group by ID', async () => {
    const newGroup = await request(app)
      .post('/groups/create')
      .send({ groupName: 'Group to Fetch', adminId: adminUser._id });

    const groupId = newGroup.body.group._id;
    const response = await request(app).get(`/groups/${groupId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Group to Fetch');
  });

  it('should delete a group by ID', async () => {
    const newGroup = await request(app)
      .post('/groups/create')
      .send({ groupName: 'Group to Delete', adminId: adminUser._id });

    const groupId = newGroup.body.group._id;
    const response = await request(app).delete(`/groups/${groupId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('deleted successfully');
  });
});
