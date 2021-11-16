'use strict';
const express = require('express');
const router = express.Router();
const { foodsController } = require('../controller');
const tokenValidate = require('../middleware/tokenValidate');
const error = require('../middleware/errosFoods');

router.get('/foods', error.get, foodsController.getFoods);
router.get('/foods/:id', [error.getById, error.existFoodById], foodsController.getFoodById);
router.post('/foods', [tokenValidate, error.post, error.existFoodByName], foodsController.postFood);
router.patch(
  '/foods/:id',
  [tokenValidate, error.patch, error.existFoodById, error.existFoodByName],
  foodsController.patchFoodById
);
router.delete('/foods/:id', [tokenValidate, error.del], foodsController.deleteFoodById);

module.exports = router;
