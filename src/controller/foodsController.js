'use strict';
const { foodsModel } = require('../models');
const { foodType } = require('../schemas');

const getFoods = async (req, res) => {
  try {
    const foods = await foodsModel.find();
    res.status(200).json({ foods, messages: 'ok' });
  } catch (error) {
    res.status(404).json({ foods: [], messages: 'Not Found' });
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
    res.status(404).json({ id, messages: 'Not Found' });
  }
};

const postFood = async (req, res) => {
  const food = req.body;
  const validations = foodType.validate(food);
  const errors = validations.error?.details ?? false;
  const existsFood = await foodsModel.find({ name: food.name });

  if (errors.length) {
    return res.status(404).json({ food, message: errors[0].message });
  }
  if (existsFood.length) {
    return res.status(404).json({ food: existsFood, message: 'food already exists' });
  }

  try {
    const newfood = await new foodsModel(food);
    newfood.save();
    res.status(201).json({ food: newfood, messages: 'Created' });
  } catch (error) {
    res.status(400).json({ foods: [], messages: 'Bad Request' });
  }
};

const patchFoodById = async (req, res) => {
  res.send('patchFoodById');
};

const deleteFoodById = async (req, res) => {
  res.send('deleteFoodById');
};

module.exports = {
  getFoods,
  getFoodById,
  postFood,
  patchFoodById,
  deleteFoodById,
};
