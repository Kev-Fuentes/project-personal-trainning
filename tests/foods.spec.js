const app = require('../src/app');
const supertest = require('supertest');
const api = supertest(app);
const { initialFoods } = require('./helpers');
const { stub } = require('sinon');

const { Food } = require('../src/models');

const findFood = stub(Food, 'find');
const findFoodById = stub(Food, 'findById');
const { redis } = require('../src/config')
const redisClient = stub(redis, 'getClient')
const [foodbyID] = initialFoods
const findOneAndUpdate = stub(Food, 'findOneAndUpdate')



beforeEach(() => {
  findOneAndUpdate.resolves({})
  findFood.resolves(initialFoods);
  redisClient.returns({
    get: () => '',
    set: () => '',
    del: () => ''
  })

  findFoodById.resolves(foodbyID);
});

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

describe('GET FOOD BY ID', () => {


  test('should repond with a food by id', async () => {
    const response = await api.get('/api/v1/foods')
    const [food] = response.body.foods
    await api
      .get(`/api/v1/foods/${food.id}`)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body.food.name).toBe(food.name);
      });
  });
});





afterEach(() => {
  findFood.resetHistory();
  findFoodById.resetHistory();
  redisClient.resetHistory();
});