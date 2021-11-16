'use strict';
const { FoodRepository } = require('../repositories');
const { redis } = require('../config');
const logger = require('@condor-labs/logger');

const {
  status: { OK, BAD_RESQUEST, CREATE, ERROR_400, ERROR_404, NOT_FOUND, SUCCESS },
} = require('../constants');

const getFoods = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const foods = await FoodRepository.getfoodPagination(page, limit);
    res.status(OK).json({ foods, messages: SUCCESS });
  } catch (error) {
    logger.err('Error get food', error);
    res.status(ERROR_404).json({ foods: [], messages: NOT_FOUND });
  }
};

const getFoodById = async (req, res) => {
  const { id } = req.params;
  const client = await redis.getClient();

  const foodCache = await client.get(id);

  if (foodCache) {
    return res.status(OK).json({ food: JSON.parse(foodCache), messages: SUCCESS });
  }

  try {
    const food = await FoodRepository.getById({ _id: id });

    client.set(id, JSON.stringify(food));
    return res.status(OK).json({ food, messages: SUCCESS });
  } catch (error) {
    logger.err('Error get food by id', error);
    res.status(ERROR_404).json({ food: {}, messages: NOT_FOUND });
  }
};

const postFood = async (req, res) => {
  const food = req.body;

  try {
    const newFood = await FoodRepository.post(food);
    res.status(CREATE).json({ food: newFood, messages: SUCCESS });
  } catch (error) {
    logger.err('Error create food', error);
    res.status(ERROR_400).json({ food: {}, messages: BAD_RESQUEST });
  }
};

const patchFoodById = async (req, res) => {
  const { id } = req.params;
  const food = req.body;
  const client = await redis.getClient();

  try {
    const updateFood = await FoodRepository.patch({ _id: id }, food);
    client.del(id);
    res.status(OK).json({ food: updateFood, messages: SUCCESS });
  } catch (error) {
    res.status(ERROR_400).json({ food: {}, messages: BAD_RESQUEST });
  }
};

const deleteFoodById = async (req, res) => {
  const { id } = req.params;
  const client = await redis.getClient();

  try {
    await FoodRepository.del({ _id: id });
    client.del(id);
    res.status(OK).json({ food: { _id: id }, messages: SUCCESS });
  } catch (error) {
    logger.err('Error delete food', error);
    res.status(ERROR_404).json({ food: {}, messages: NOT_FOUND });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  postFood,
  patchFoodById,
  deleteFoodById,
};
