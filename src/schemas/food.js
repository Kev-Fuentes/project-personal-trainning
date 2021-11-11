'use strict';
const Joi = require('joi');

const schemaGetFood = Joi.object({
  page: Joi.number().positive().min(1).optional(),
  limit: Joi.number().positive().min(1).optional(),
});

const schemaGetFoodById = Joi.object({
  _id: Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .required(),
});

const schemaDeleteFood = Joi.object({
  _id: Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .required(),
});

const schemaPostFood = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z\s]*$/)
    .trim()
    .min(4)
    .max(30)
    .required(),
  price: Joi.number().positive().min(1).required(),
  type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'fast food').required(),
  available: Joi.boolean().default(true).optional(),
});

const schemaPatchFood = Joi.object({
  _id: Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .required(),
  name: Joi.string()
    .regex(/^[a-zA-Z\s]*$/)
    .trim()
    .min(4)
    .max(30)
    .optional(),
  price: Joi.number().positive().min(1).optional(),
  type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'fast food').optional(),
  available: Joi.boolean().default(true).optional(),
});

module.exports = {
  schemaGetFood,
  schemaGetFoodById,
  schemaPostFood,
  schemaPatchFood,
  schemaDeleteFood,
};
