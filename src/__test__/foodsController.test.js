require('../app');
const { foodsController } = require('../controller');
const { FoodRepository } = require('../repositories');
const { redis } = require('../config');
const { stub } = require('sinon');
const { builderFood, idBuild, newFood, updateFoodBuild, dataPagination } = require('./utils/utils');

jest.mock('../repositories');

const redisClient = stub(redis, 'getClient');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Food controller', () => {
  describe('get Food', () => {

    it('It should return a food and response http status 200', async () => {
      const req = { query: { page: 1, limit: 10 } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };

      FoodRepository.getfoodPagination.mockImplementation((page, limit) => {
        return dataPagination.slice((page - 1) * limit, page * limit);
      });

      await foodsController.getFoods(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(FoodRepository.getfoodPagination(req.query.page, req.query.limit)).toHaveLength(dataPagination.length);
      expect(res.json).toHaveBeenCalledWith({ foods: dataPagination, messages: 'OK' });
      expect(res.json).toHaveBeenCalledTimes(1);

    });

    it('Error on server get', async () => {
      const req = { query: { page: 1, limit: 10 } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };

      FoodRepository.getfoodPagination.mockRejectedValueOnce(new Error());

      await foodsController.getFoods(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ foods: [], messages: 'Not Found' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe('get food by id', () => {


    it('It should return a food from redis and http status 200', async () => {
      const id = idBuild;
      const food = builderFood(id);
      const req = { params: { id } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };

      FoodRepository.getById.mockReturnValue(food);

      redisClient.returns({
        get: (id) => {
          const [cacheFood] = [food].filter(() => {
            return food._id === id;
          });
          return JSON.stringify(cacheFood);
        },
        set: () => jest.fn(),
      });

      await foodsController.getFoodById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status).toHaveBeenCalledTimes(1);

      expect(res.json).toHaveBeenCalledWith({ food, messages: 'OK' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('It should return a food and http status 200', async () => {
      const id = idBuild;
      const food = builderFood(id);
      const req = { params: { id } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };

      redisClient.returns({
        get: (id) => {
          const [cacheFood] = [food].filter(() => {
            return food._id === id;
          });
          return JSON.stringify(cacheFood);
        },
        set: () => jest.fn(),
      });


      FoodRepository.getById.mockReturnValue(food);

      await foodsController.getFoodById(req, res);


      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status).toHaveBeenCalledTimes(1);

      expect(res.json).toHaveBeenCalledWith({ food, messages: 'OK' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('Error on server getbyid', async () => {

      const id = idBuild;
      const req = { params: { id } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };

      redisClient.returns({
        get: () => { jest.fn() },
        set: () => jest.fn(),
      });

      FoodRepository.getById.mockRejectedValueOnce(new Error());
      // act
      await foodsController.getFoodById(req, res);
      // assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ food: {}, messages: 'Not Found' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe('post Food', () => {


    it('It should return a new food and response http status 201', async () => {

      const req = { body: { food: newFood } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };
      FoodRepository.post.mockImplementation((food) => {
        return {
          _id: idBuild,
          ...food,
        };
      });
      await foodsController.postFood(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ food: { _id: idBuild, ...newFood }, messages: 'OK' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('It should return error post', async () => {
      const req = { body: { food: {} } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };
      FoodRepository.post.mockRejectedValueOnce(new Error());

      await foodsController.postFood(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ food: {}, messages: 'Bad Request' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe('update Food', () => {


    it('It should return a update food and response http status 200', async () => {
      const id = idBuild;
      const food = builderFood(id);
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };
      const req = {
        body: { food: updateFoodBuild },
        params: { id: idBuild },
      };

      redisClient.returns({
        del: () => jest.fn(),
      });

      FoodRepository.patch.mockImplementation(({ _id }, foodUpdate) => {
        const [foodMap] = [food].map((food) => {
          if (food._id === _id) {
            return { ...food, ...foodUpdate.food };
          }
        });
        return foodMap;
      });
      await foodsController.patchFoodById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ food: { _id: idBuild, ...updateFoodBuild }, messages: 'OK' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('It should return error update', async () => {
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };
      const req = {
        body: { food: {} },
        params: { id: '' },
      };
      FoodRepository.patch.mockRejectedValueOnce(new Error());

      await foodsController.patchFoodById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ food: {}, messages: 'Bad Request' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete food', () => {
    it('delete It should return id food and status 200', async () => {
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
      };

      const req = {
        params: { id: idBuild },
      };

      redisClient.returns({
        del: () => jest.fn(),
      });

      FoodRepository.del.mockReturnValue({ _id: idBuild });

      await foodsController.deleteFoodById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ food: { _id: idBuild }, messages: 'OK' });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  it('It should return error in delete', async () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };

    const req = {
      params: { id: '' },
    };

    redisClient.returns({
      del: () => jest.fn(),
    });

    FoodRepository.del.mockRejectedValueOnce(new Error());

    await foodsController.deleteFoodById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ food: {}, messages: 'Not Found' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});

afterEach(() => {
  redisClient.resetHistory();
});
