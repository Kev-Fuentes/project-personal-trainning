'use strict';
const { foodsModel } = require('../../models');
const { redis } = require('../../config');

const resolvers = {
  Query: {
    foods: async () => {
      try {
        const client = await redis();
        const reply = await client.get('food');

        if (reply) {
          return JSON.params(reply);
        }

        const foods = await foodsModel.find();

        await client.set('foods', JSON.stringify(foods));
        return foods;
      } catch (error) {
        logger.err("Error get food by GraphQL", error);
        return []
      }

    },

    foodById: async (_, { id }) => {
      try {
        const foods = await foodsModel.findById({ _id: id });
        return foods;
      } catch (error) {
        logger.err("Error get food by id GraphQL", error);
        return []
      }

    },
  },

  Mutation: {
    postFood: async (_, { input }) => {
      try {
        const newfood = await new foodsModel(input);
        newfood.save();
        return newfood;
      } catch (error) {
        logger.err("Error create food with GraphQL", error);
        return []
      }

    },
    updateFood: async (_, { _id, input }) => {
      try {
        return await foodsModel.findByIdAndUpdate(_id, input, { new: true });
      } catch (error) {
        logger.err("Error get food by id GraphQL", error);
        return []
      }

    },

    deleteFood: async (_, { _id }) => {
      try {
        return await foodsModel.findByIdAndDelete(_id);

      } catch (error) {
        logger.err("Error get food by id GraphQL", error);
        return []
      }
    },
  },
};

module.exports = resolvers;
