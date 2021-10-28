'use strict';
const express = require('express');
const router = express.Router();
const { foodsController } = require('../controller');

router.get('/foods', foodsController.getFoods);
router.get('/foods/:id', foodsController.getFoodById);
router.post('/foods', foodsController.postFood);
router.put('/foods/:id', foodsController.patchFoodById);
router.delete('/foods/:id', foodsController.deleteFoodById);

module.exports = router;
