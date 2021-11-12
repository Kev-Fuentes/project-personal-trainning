require('../app');
const { foodsController } = require('../controller');
const { schemaGetFoodById } = require('../schemas');
const { validateJoi } = require('../helpers');
const { FoodRepository } = require('../repositories');
const { redis } = require('../config');
const { builderFood } = require('./utils/utils');

jest.mock('../repositories');
jest.mock('../config');

beforeEach(() => {
    jest.clearAllMocks();
});

describe.skip('Food controller', () => {
    describe('get food by id', () => {
        const id = '718c12a6adeb13145f97bee8';
        const food = builderFood(id);
        const req = { params: { id } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        FoodRepository.getById.mockReturnValue(food);

        it('It should return a food from redis and http status 200', async () => {

            redis.getClient.mockResolvedValueOnce({
                get: (id = id) => JSON.stringify(food),
                set: () => '',
            });


            await foodsController.getFoodById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status).toHaveBeenCalledTimes(1);

            expect(res.json).toHaveBeenCalledWith({ food, messages: 'OK' });
            expect(res.json).toHaveBeenCalledTimes(1);
        });

        it('It should return a food and http status 200', async () => {

            redis.getClient.mockResolvedValueOnce({
                get: () => '',
                set: () => '',
            });


            await foodsController.getFoodById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status).toHaveBeenCalledTimes(1);

            expect(res.json).toHaveBeenCalledWith({ food, messages: 'OK' });
            expect(res.json).toHaveBeenCalledTimes(1);
        });

        it('Error format id response error 400', async () => {
            const idError = '718c12a6adeb13145f97be';
            const error = validateJoi(schemaGetFoodById, { _id: idError });
            FoodRepository.getById.mockRejectedValueOnce([]);
            redis.getClient.mockResolvedValueOnce({
                get: () => '',
                set: () => '',
            });
            const req = { params: { id: idError } };


            await foodsController.getFoodById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ foods: [], message: error });
            expect(res.json).toHaveBeenCalledTimes(1);
        });

        it('Error on server', async () => {
            const id = '718c12a6adeb13145f97bee2';
            FoodRepository.getById.mockRejectedValueOnce({});
            redis.getClient.mockResolvedValueOnce({
                get: () => '',
                set: () => '',
            });
            const req = { params: { id } };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(() => res),
            };

            await foodsController.getFoodById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ food: {}, messages: 'Not Found' });
            expect(res.json).toHaveBeenCalledTimes(1);
        });



    });
});
