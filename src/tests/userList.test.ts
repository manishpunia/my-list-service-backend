// src/tests/userList.test.ts
import request from 'supertest'; // Removed { Response } here
import mongoose from 'mongoose';
import app from '../app';
import UserList from '../models/UserList';
import dotenv from 'dotenv';

dotenv.config();

const MOCK_USER_ID = 'mockUser123';
const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test_mylistdb';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

beforeEach(async () => {
  await UserList.deleteMany({});
  const userList = new UserList({
    userId: MOCK_USER_ID,
    contentIds: ['initial_movie_1', 'initial_tvshow_2'],
  });
  await userList.save();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User List API Endpoints', () => {
  it('should add a new item to the user list', async () => {
    const newItem = 'new_movie_3';
    const res = await request(app)
      .post('/api/my-list/add')
      .send({ contentId: newItem }) as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Item added to list successfully.');
    expect(res.body.userList.contentIds).toContain(newItem);

    const updatedList = await UserList.findOne({ userId: MOCK_USER_ID });
    expect(updatedList?.contentIds || []).toContain(newItem);
  });

  it('should not add a duplicate item to the user list', async () => {
    const existingItem = 'initial_movie_1';
    const res = await request(app)
      .post('/api/my-list/add')
      .send({ contentId: existingItem }) as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual('Item already in your list.');

    const userList = await UserList.findOne({ userId: MOCK_USER_ID });
    expect((userList?.contentIds || []).filter(id => id === existingItem).length).toBe(1);
  });

  it('should return 400 if contentId is missing for add', async () => {
    const res = await request(app)
      .post('/api/my-list/add')
      .send({}) as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Content ID is required.');
  });

  it('should remove an item from the user list', async () => {
    const itemToRemove = 'initial_movie_1';
    const res = await request(app)
      .delete(`/api/my-list/remove/${itemToRemove}`) as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Item removed from list successfully.');
    expect(res.body.userList.contentIds).toBeDefined();
    expect(res.body.userList.contentIds).not.toContain(itemToRemove);

    const updatedList = await UserList.findOne({ userId: MOCK_USER_ID });
    expect(updatedList?.contentIds || []).not.toContain(itemToRemove);
  });

  it('should return 404 if item not found in list for removal', async () => {
    const nonExistentItem = 'non_existent_item';
    const res = await request(app)
      .delete(`/api/my-list/remove/${nonExistentItem}`) as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Item not found in your list.');
  });

  it('should list all items for a user (no pagination)', async () => {
    const res = await request(app)
      .get('/api/my-list') as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('My list retrieved successfully.');
    expect(res.body.items).toEqual(['initial_movie_1', 'initial_tvshow_2']);
    expect(res.body.totalItems).toEqual(2);
    expect(res.body.currentPage).toEqual(1);
    expect(res.body.totalPages).toEqual(1);
  });

  it('should list items with pagination (page 1, limit 1)', async () => {
    await request(app).post('/api/my-list/add').send({ contentId: 'item_3' });
    await request(app).post('/api/my-list/add').send({ contentId: 'item_4' });

    const res = await request(app)
      .get('/api/my-list?page=1&limit=1') as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(200);
    expect(res.body.items).toEqual(['initial_movie_1']);
    expect(res.body.totalItems).toEqual(4);
    expect(res.body.currentPage).toEqual(1);
    expect(res.body.totalPages).toEqual(4);
  });

  it('should list items with pagination (page 2, limit 2)', async () => {
    await request(app).post('/api/my-list/add').send({ contentId: 'item_3' });
    await request(app).post('/api/my-list/add').send({ contentId: 'item_4' });

    const res = await request(app)
      .get('/api/my-list?page=2&limit=2') as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(200);
    expect(res.body.items).toEqual(['item_3', 'item_4']);
    expect(res.body.totalItems).toEqual(4);
    expect(res.body.currentPage).toEqual(2);
    expect(res.body.totalPages).toEqual(2);
  });

  it('should return empty list if user list is empty', async () => {
    await UserList.deleteMany({});

    const res = await request(app)
      .get('/api/my-list') as any; // <--- Cast to 'any'

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Your list is empty.');
    expect(res.body.items).toEqual([]);
    expect(res.body.totalItems).toEqual(0);
  });
});