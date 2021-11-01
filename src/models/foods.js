'use strict';
require('../config/mongodb/connet');
const { MongoDB } = require('../config');
const mongoose = MongoDB.mongoose;

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['breakfast', 'lunch', 'dinner', 'fast food'],
    },
  },
  available: { type: Boolean, default: true },
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
