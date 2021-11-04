const { initialFoods, api } = require('./helpers');
const { stub } = require('sinon');
jest.useFakeTimers()
const { Food } = require('../src/models');

const findFood = stub(Food, 'find');


beforeEach(() => {
  findFood.resetHistory();
});

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
