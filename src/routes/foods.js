'use strict';
const express = require('express');
const router = express.Router();
const { foodsController } = require('../controller');
const tokenValidate = require('../middleware/tokenValidate');

router.get('/foods', foodsController.getFoods);
router.get('/foods/:id', foodsController.getFoodById);
router.post('/foods', tokenValidate, foodsController.postFood);
router.patch('/foods/:id', tokenValidate, foodsController.patchFoodById);
router.delete('/foods/:id', tokenValidate, foodsController.deleteFoodById);

module.exports = router;
