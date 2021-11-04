const app = require('../src/app');
const supertest = require('supertest');
const api = supertest(app);
const { MongoDB } = require('../src/config');
const mongoose = MongoDB.mongoose;
const redis = require('@condor-labs/redis')();
const { initialFoods } = require('./helpers');
const { stub } = require('sinon');
const { Food } = require('../src/models');
const findFood = stub(Food, 'find');




describe(' GET FOODS', () => {

  findFood.resolves(initialFoods);

  test('should repond with 200 status code', async () => {
    await api
      .get('/api/v1/foods')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('should repond with an array of foods ', async () => {
    const response = await api.get('/api/v1/foods');
    expect(response.body.foods).toHaveLength(initialFoods.length);
  });
});


afterAll(async () => {
  const redisc = await redis.getClient();
  await mongoose.disconnect();
  await redisc.quit();
});
