'use strict';
const BaseRepository = require('../baseRepository');
const { Food } = require('../../models');

const FoodRepository = (() => {
  const { get, getById, patch, post, del } = BaseRepository(Food);
  return {
    get,
    getById,
    del,
    patch,
    post,
    getfoodPagination: async (page, limit) => {
      return await Food.find()
        .limit(limit * 1)
        .skip((page - 1) * limit);
    },
    getFoodName: async (name) => {
      return await Food.find(name);
    },
  };
})();

module.exports = FoodRepository;
