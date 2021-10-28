'use strict';
const { foodsModel } = require('../../models');

const resolvers = {
  Query: {
    foods: async () => {
      const foods = await foodsModel.find();
      return foods;
    },
    foodById: async (_, { id }) => {
      const foods = await foodsModel.findById({ _id: id });
      return foods;
    },
  },
  Mutation: {
    postFood: async (_, { input }) => {
      const newfood = await new foodsModel(input);
      newfood.save();
      return newfood;
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
