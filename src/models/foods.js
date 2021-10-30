'use strict';
const { MongoDB } = require('../config');
const mongoose = MongoDB.mongoose;


const foodsSchema = new mongoose.Schema({
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

const foodsModel = mongoose.model('Foods', foodsSchema);

module.exports = foodsModel;
