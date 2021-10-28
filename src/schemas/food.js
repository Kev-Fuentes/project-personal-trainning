'use strict';
const Joi = require('joi');

const schemaPostFood = Joi.object({
  name: Joi.string().alphanum().min(4).max(30).required(),
  price: Joi.number().min(1).required(),
  type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'fast food').required(),
  available: Joi.boolean().default(true).optional(),
});

const schemaPatchFood = Joi.object({
  name: Joi.string().alphanum().min(4).max(30).optional(),
  price: Joi.number().min(1).optional(),
  type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'fast food').optional(),
  available: Joi.boolean().default(true).optional(),
});

module.exports = {
  schemaPostFood,
  schemaPatchFood,
};
