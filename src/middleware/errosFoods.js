const { validateJoi } = require('../helpers');
const { schemaPostFood, schemaPatchFood, schemaGetFood, schemaGetFoodById, schemaDeleteFood } = require('../schemas');
const {
  status: { ERROR_400, ERROR_404, EXISTING_RESOURCE, NOT_FOUND },
} = require('../constants');
const { FoodRepository } = require('../repositories');

const get = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const error = validateJoi(schemaGetFood, { page, limit });
  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }

  next();
};

const getById = (req, res, next) => {
  const { id } = req.params;

  const error = validateJoi(schemaGetFoodById, { _id: id });

  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }

  next();
};

const post = (req, res, next) => {
  const { food } = req.body;
  const error = validateJoi(schemaPostFood, food);

  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }
  next();
};

const patch = (req, res, next) => {
  const { id } = req.params;
  const food = req.body;
  const error = validateJoi(schemaPatchFood, { ...food, _id: id });
  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }
  next();
};

const del = (req, res, next) => {
  const { id } = req.params;
  const error = validateJoi(schemaDeleteFood, { _id: id });

  if (error) {
    return res.status(ERROR_400).json({ foods: [], message: error });
  }
  next();
};

const existFoodById = async (req, res, next) => {
  const { id } = req.params;
  const food = await FoodRepository.getById({ _id: id });
  if (!food) {
    return res.status(ERROR_404).json({ food: {}, messages: NOT_FOUND });
  }
  next();
};

const existFoodByName = async (req, res, next) => {
  const food = req.body;
  const existsFood = await FoodRepository.getFoodName({ name: food.name });
  if (existsFood.length) {
    return res.status(ERROR_404).json({ food: existsFood, message: EXISTING_RESOURCE });
  }
  next();
};

module.exports = { get, getById, post, patch, del, existFoodById, existFoodByName };
