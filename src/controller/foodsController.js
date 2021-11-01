'use strict';
const { Food } = require('../models');
const { schemaPostFood, schemaPatchFood } = require('../schemas');
const { redis } = require('../config');
const logger = require('@condor-labs/logger');
const {
  status: { OK, BAD_RESQUEST, CREATE, ERROR_400, ERROR_404, EXISTING_RESOURCE, NOT_FOUND, SUCCESS },
} = require('../constants');

const getFoods = async (req, res) => {
  const client = await redis();

  try {
    const reply = await client.get('food');
    if (reply) {
      return res.status(OK).json({ foods: JSON.params(reply), messages: SUCCESS });
    }

    const foods = await Food.find();
    await client.set('foods', JSON.stringify(foods));

    res.status(OK).json({ foods, messages: SUCCESS });
  } catch (error) {
    logger.err('Error get food', error);
    res.status(ERROR_404).json({ foods: [], messages: NOT_FOUND });
  }
};

const getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Food.findById({ _id: id });
    if (food) {
      return res.status(200).json({ food, messages: 'ok' });
    }
  } catch (error) {
    logger.err('Error get food by id', error);
    res.status(404).json({ food: [], messages: 'Not Found' });
  }
};

const postFood = async (req, res) => {
  const food = req.body;
  const validations = schemaPostFood.validate(food);
  const errors = validations.error?.details ?? false;
  const existsFood = await Food.find({ name: food.name });

  if (existsFood.length) {
    return res.status(ERROR_404).json({ food: existsFood, message: EXISTING_RESOURCE });
  }

  if (errors.length) {
    return res.status(ERROR_404).json({ food, message: errors[0].message });
  }

  try {
    const newfood = await new Food(food);
    newfood.save();
    res.status(CREATE).json({ food: newfood, messages: SUCCESS });
  } catch (error) {
    logger.err('Error create food', error);
    res.status(ERROR_400).json({ foods: [], messages: BAD_RESQUEST });
  }
};

const patchFoodById = async (req, res) => {
  const { id } = req.params;
  const food = req.body;
  const validations = schemaPatchFood.validate(food);
  const errors = validations.error?.details ?? false;
  const existsFoodbByName = await Food.find({ name: food.name });
  const existsFoodById = await Food.findById({ _id: id });
  if (!food) {
    return res.status(ERROR_404).json({ food, message: NOT_FOUND });
  }
  if (!existsFoodById) {
    return res.status(ERROR_404).json({ food: [], message: NOT_FOUND });
  }
  if (existsFoodbByName.length) {
    return res.status(ERROR_404).json({ food: existsFoodbByName, message: EXISTING_RESOURCE });
  }

  if (errors.length) {
    return res.status(404).json({ food, message: errors[0].message });
  }

  try {
    const updateFood = await Food.findOneAndUpdate({ _id: id }, food, { new: true });
    res.status(OK).json({ food: updateFood, messages: SUCCESS });
  } catch (error) {
    res.status(ERROR_400).json({ foods: [], messages: BAD_RESQUEST });
  }
};

const deleteFoodById = async (req, res) => {
  const { id } = req.params;
  const existsFood = await Food.findById({ _id: id });
  if (!existsFood) {
    return res.status(404).json({ foods: {}, messages: NOT_FOUND });
  }
  try {
    const deleteFood = await Food.findOneAndDelete({ _id: id });
    res.status(OK).json({ food: deleteFood, messages: SUCCESS });
  } catch (error) {
    logger.err('Error delete food', error);
    res.status(ERROR_404).json({ foods: [], messages: NOT_FOUND });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  postFood,
  patchFoodById,
  deleteFoodById,
};
