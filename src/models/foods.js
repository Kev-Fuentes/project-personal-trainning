'use strict';
const mongodb = require('@condor-labs/mongodb')();

const foodsSchema = new mongodb.mongoose.Schema({
  name: {
    type: String,
    required: true,
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

const foodsModel = mongodb.mongoose.model('Foods', foodsSchema);

module.exports = foodsModel;
