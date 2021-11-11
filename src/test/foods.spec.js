const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);
const { initialFoods, newFood, createInitialFood, deleteInitialFood } = require('./helpers');
const { stub } = require('sinon');
const { redis } = require('../config');
const { FoodRepository } = require('../repositories');
const [foodById] = initialFoods;

const deleteOneFood = deleteInitialFood.filter((food) => food.id !== foodById.id);

const findFood = stub(FoodRepository, 'getfoodPagination');
const findFoodById = stub(FoodRepository, 'getById');
const findByName = stub(FoodRepository, 'getFoodName');
const redisClient = stub(redis, 'getClient');
const findOneAndUpdate = stub(FoodRepository, 'patch');
const foodSave = stub(FoodRepository, 'post');
const deleteFood = stub(FoodRepository, 'del');

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
  findByName.resolves(foodById);
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
      .expect(200)
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
  findByName.resetHistory();
});
