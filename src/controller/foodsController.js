'use strict';
const { foodsModel } = require('../models');
const { schemaPostFood, schemaPatchFood } = require('../schemas');

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
    res.status(404).json({ food: [], messages: 'Not Found' });
  }
};

const postFood = async (req, res) => {
  const food = req.body;
  const validations = schemaPostFood.validate(food);
  const errors = validations.error?.details ?? false;
  const existsFood = await foodsModel.find({ name: food.name });

  if (existsFood.length) {
    return res.status(404).json({ food: existsFood, message: 'food already exists' });
  }

  if (errors.length) {
    return res.status(404).json({ food, message: errors[0].message });
  }


  try {
    const newfood = await new foodsModel(food);
    newfood.save();
    res.status(201).json({ food: newfood, messages: 'ok' });
  } catch (error) {
    res.status(400).json({ foods: [], messages: 'Bad Request' });
  }
};

const patchFoodById = async (req, res) => {
  const { id } = req.params;
  const food = req.body
  const validations = schemaPatchFood.validate(food);
  const errors = validations.error?.details ?? false;
  const existsFoodbByName = await foodsModel.find({ name: food.name });
  const existsFoodById = await foodsModel.findById({ _id: id });
  if (!food) {
    return res.status(404).json({ food, message: 'Not Found' });
  }
  if (!existsFoodById) {
    return res.status(404).json({ food: [], message: 'Not Found' });
  }
  if (existsFoodbByName.length) {
    return res.status(404).json({ food: existsFoodbByName, message: 'food already exists' });
  }

  if (errors.length) {
    return res.status(404).json({ food, message: errors[0].message });
  }


  try {
    const updateFood = await foodsModel.findOneAndUpdate({ _id: id }, food, { new: true });
    res.status(201).json({ food: updateFood, messages: 'ok' });
  } catch (error) {
    res.status(400).json({ foods: [], messages: 'Bad Request' });
  }
};

const deleteFoodById = async (req, res) => {
  const { id } = req.params;
  const existsFood = await foodsModel.findById({ _id: id });
  if (!existsFood) {
    return res.status(404).json({ foods: {}, messages: 'Not Found' });
  }
  try {
    const deleteFood = await foodsModel.findOneAndDelete({ _id: id });
    res.status(200).json({ food: deleteFood, messages: 'ok' });
  } catch (error) {
    res.status(404).json({ foods: [], messages: 'Not Found' });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  postFood,
  patchFoodById,
  deleteFoodById,
};
