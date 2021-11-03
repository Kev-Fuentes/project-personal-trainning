
const app = require('../src/app');
const supertest = require('supertest');
const api = supertest(app);
const { initialFoods } = require('./helpers')
describe(' GET FOODS', () => {
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


