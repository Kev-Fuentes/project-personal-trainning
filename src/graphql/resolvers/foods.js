'use strict';
const { foodsModel } = require('../../models');

const resolvers = {
  Query: {
    foods: async () => {
      const foods = await foodsModel.find();
      return foods;
    },
  },
  Mutation: {
    createFood: (_, { input }) => {
      const newFood = new foodsModel(input);
      newFood.save();
      return newFood;
    },
    updateFood: (_, { _id, input }) => {
      return foodsModel.findByIdAndUpdate(_id, input, { new: true });
    },

    deleteFood: (_, { _id }) => {
      return foodsModel.findByIdAndDelete(_id);
    },
  },
};

module.exports = resolvers;
