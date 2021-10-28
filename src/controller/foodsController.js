'use strict';
const { foodsModel } = require('../models');
const { schemaPostFood, schemaPatchFood } = require('../schemas');
const { status: { OK,
  BAD_RESQUEST,
  CREATE, ERROR_400,
  ERROR_404,
  EXISTING_RESOURCE,
  NOT_FOUND, SUCCESS }, } = require('../constants');
const redis = require('@condor-labs/redis')();

const getFoods = async (req, res) => {
  try {
    const foods = await foodsModel.find();
    res.status(OK).json({ foods, messages: SUCCESS });
  } catch (error) {
    res.status(ERROR_404).json({ foods: [], messages: NOT_FOUND });
  }
};

const getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await foodsModel.findById({ _id: id });
    if (food) {
      return res.status(200).json({ food, messages: 'ok' });
    }
  } catch (error) {
    res.status(404).json({ food: [], messages: 'Not Found' });
  }
};

const postFood = async (req, res) => {
  const food = req.body;
  const validations = schemaPostFood.validate(food);
  const errors = validations.error?.details ?? false;
  const existsFood = await foodsModel.find({ name: food.name });

  if (existsFood.length) {
    return res.status(ERROR_404).json({ food: existsFood, message: EXISTING_RESOURCE });
  }

  if (errors.length) {
    return res.status(ERROR_404).json({ food, message: errors[0].message });
  }

  try {
    const newfood = await new foodsModel(food);
    newfood.save();
    res.status(CREATE).json({ food: newfood, messages: SUCCESS });
  } catch (error) {
    res.status(ERROR_400).json({ foods: [], messages: BAD_RESQUEST });
  }
};

const patchFoodById = async (req, res) => {
  const { id } = req.params;
  const food = req.body;
  const validations = schemaPatchFood.validate(food);
  const errors = validations.error?.details ?? false;
  const existsFoodbByName = await foodsModel.find({ name: food.name });
  const existsFoodById = await foodsModel.findById({ _id: id });
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
    const updateFood = await foodsModel.findOneAndUpdate({ _id: id }, food, { new: true });
    res.status(OK).json({ food: updateFood, messages: SUCCESS });
  } catch (error) {
    res.status(ERROR_400).json({ foods: [], messages: BAD_RESQUEST });
  }
};

const deleteFoodById = async (req, res) => {
  const { id } = req.params;
  const existsFood = await foodsModel.findById({ _id: id });
  if (!existsFood) {
    return res.status(404).json({ foods: {}, messages: NOT_FOUND });
  }
  try {
    const deleteFood = await foodsModel.findOneAndDelete({ _id: id });
    res.status(OK).json({ food: deleteFood, messages: SUCCESS });
  } catch (error) {
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
