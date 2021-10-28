'use strict';
const { foodsModel } = require('../../models');
const { redis } = require('../../config');

const resolvers = {
  Query: {
    foods: async () => {
      const client = await redis();
      const reply = await client.get('food');

      if (reply) {
        return JSON.params(reply);
      }

      const foods = await foodsModel.find();

      await client.set('foods', JSON.stringify(foods));
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
