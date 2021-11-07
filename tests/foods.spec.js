const app = require('../src/app');
const supertest = require('supertest');
const api = supertest(app);
const { initialFoods, newFood, createInitialFood, deleteInitialFood } = require('./helpers');
const { stub } = require('sinon');
const { Food } = require('../src/models');
const { redis } = require('../src/config');
const [foodById] = initialFoods;
const newFoodTest = Food(newFood);
const deleteOneFood = deleteInitialFood.filter((food) => food.id !== foodById.id);

const findFood = stub(Food, 'find');
const findFoodById = stub(Food, 'findById');
const redisClient = stub(redis, 'getClient');
const findOneAndUpdate = stub(Food, 'findOneAndUpdate');
const foodSave = stub(newFoodTest, 'save');
const deleteFood = stub(Food, 'findOneAndDelete');

beforeEach(() => {
  foodSave.resolves(createInitialFood.push({ ...newFood, id: 3 }));
  findOneAndUpdate.resolves(foodById);
  findFood.resolves(initialFoods);
  redisClient.returns({
    get: () => '',
    set: () => '',
    del: () => '',
  });
  deleteFood.resolves(deleteOneFood);
  findFoodById.resolves(foodById);
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
    const response = await api.get('/api/v1/foods');
    const [food] = response.body.foods;
    await api
      .get(`/api/v1/foods/${food.id}`)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body.food.name).toBe(food.name);
      });
  });
});

describe('UPDATE FOOD', () => {
  test('should repond with update a food', async () => {
    findFood.resolves(foodById);
    const response = await api.get('/api/v1/foods');
    const food = response.body.foods;

    const updateName = {
      name: 'Panqueque',
    };
    await api
      .patch(`/api/v1/foods/${food.id}`)
      .send(updateName)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body.food.name).toBe(food.name);
      });
  });
});

describe(' POST FOOD', () => {
  test('should repond with post a food', async () => {
    findFood.resolves([]);
    await api
      .post('/api/v1/foods')
      .send(newFood)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    findFood.resolves(createInitialFood);
    const response = await api.get('/api/v1/foods');
    expect(response.body.foods).toHaveLength(createInitialFood.length);
  });
});

describe(' POST FOOD', () => {
  test('should repond with post a food', async () => {
    findFood.resolves([]);
    await api
      .post('/api/v1/foods')
      .send(newFood)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    findFood.resolves(initialFoods);
    const response = await api.get('/api/v1/foods');
    expect(response.body.foods).toHaveLength(initialFoods.length);
  });
});

describe(' DELETE FOOD', () => {
  test('should repond with  delete food', async () => {
    findFood.resolves([]);
    await api.delete(`/api/v1/foods/${foodById.id}`).expect(200);

    findFood.resolves(deleteOneFood);
    const response = await api.get('/api/v1/foods');
    expect(response.body.foods).toHaveLength(deleteOneFood.length);
  });
});

afterEach(() => {
  findFood.resetHistory();
  findFoodById.resetHistory();
  redisClient.resetHistory();
  deleteFood.resetHistory();
  findOneAndUpdate.resetHistory();
  foodSave.resetHistory();
});
