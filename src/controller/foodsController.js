'use strict';
const { schemaPostFood, schemaPatchFood, schemaGetFood, schemaGetFoodById, schemaDeleteFood } = require('../schemas');
const { FoodRepository } = require('../repositories');
const { validateJoi } = require('../helpers');
const { redis } = require('../config');
const logger = require('@condor-labs/logger');

const {
  status: { OK, BAD_RESQUEST, CREATE, ERROR_400, ERROR_404, EXISTING_RESOURCE, NOT_FOUND, SUCCESS },
} = require('../constants');

const getFoods = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const error = validateJoi(schemaGetFood, { page, limit });
  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }
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
  const error = validateJoi(schemaGetFoodById, { _id: id });

  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }

  const foodCache = await client.get(id);

  if (foodCache) {
    return res.status(OK).json({ food: JSON.parse(foodCache), messages: SUCCESS });
  }

  try {
    const food = await FoodRepository.getById({ _id: id });
    if (!food) {
      return res.status(ERROR_404).json({ food: {}, messages: NOT_FOUND });
    }
    client.set(id, JSON.stringify(food));
    return res.status(OK).json({ food, messages: SUCCESS });
  } catch (error) {
    logger.err('Error get food by id', error);
    res.status(ERROR_404).json({ food: {}, messages: NOT_FOUND });
  }
};

const postFood = async (req, res) => {
  const food = req.body;
  const error = validateJoi(schemaPostFood, food);



  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }
  const existsFood = await FoodRepository.getFoodName({ name: food.name });
  if (existsFood.length) {
    return res.status(ERROR_404).json({ food: existsFood, message: EXISTING_RESOURCE });
  }
  try {
    const newFood = await FoodRepository.post(food);
    res.status(CREATE).json({ food: newFood, messages: SUCCESS });
  } catch (error) {
    logger.err('Error create food', error);
    res.status(ERROR_400).json({ foods: {}, messages: BAD_RESQUEST });
  }
};

const patchFoodById = async (req, res) => {
  const { id } = req.params;
  const food = req.body;
  const error = validateJoi(schemaPatchFood, { ...food, _id: id });
  const client = await redis.getClient();

  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }

  const existsFood = await FoodRepository.getById({ _id: id });
  const existsFoodbByName = await FoodRepository.getFoodName({ name: food.name });

  if (!existsFood) {
    return res.status(ERROR_404).json({ foods: {}, messages: NOT_FOUND });
  }

  if (existsFoodbByName.length) {
    return res.status(ERROR_404).json({ food: existsFoodbByName, message: EXISTING_RESOURCE });
  }

  try {
    const updateFood = await FoodRepository.patch({ _id: id }, food);
    client.del(id);
    res.status(OK).json({ food: updateFood, messages: SUCCESS });
  } catch (error) {
    res.status(ERROR_400).json({ foods: {}, messages: BAD_RESQUEST });
  }
};

const deleteFoodById = async (req, res) => {
  const { id } = req.params;
  const client = await redis.getClient();
  const error = validateJoi(schemaDeleteFood, { _id: id });

  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }
  const existsFood = await FoodRepository.getById({ _id: id });

  if (!existsFood) {
    return res.status(ERROR_404).json({ foods: {}, messages: NOT_FOUND });
  }
  try {
    FoodRepository.del({ _id: id });
    client.del(id);
    res.status(OK).json({ food: { _id: id }, messages: SUCCESS });
  } catch (error) {
    logger.err('Error delete food', error);
    res.status(ERROR_404).json({ foods: {}, messages: NOT_FOUND });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  postFood,
  patchFoodById,
  deleteFoodById,
};
