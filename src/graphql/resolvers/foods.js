'use strict';
const { FoodRepository } = require('../../repositories');
const { redis } = require('../../config');
const logger = require('@condor-labs/logger');

const resolvers = {
  Query: {
    foods: async () => {
      try {
        const foods = await FoodRepository.get();
        return foods;
      } catch (error) {
        logger.err('Error get food by GraphQL', error);
        return [];
      }
    },
    foodsPagination: async (_, { page, limit }) => {
      try {
        const foods = await FoodRepository.getfoodPagination(page, limit);
        return foods;
      } catch (error) {
        logger.err('Error get food by GraphQL', error);
        return [];
      }
    },

    foodById: async (_, { id }) => {
      try {
        const client = await redis.getClient();
        const redisCache = await client.get(id);
        if (redisCache) {
          return JSON.parse(redisCache);
        }
        const food = await FoodRepository.getById({ _id: id });
        if (!food) {
          logger.err('Error get food by id GraphQL', food);
          return food;
        }
        client.set(id, JSON.stringify(food));
        return food;
      } catch (error) {
        logger.err('Error get food by id GraphQL', error);
        return [];
      }
    },
  },

  Mutation: {
    postFood: async (_, { input }) => {
      try {
        const food = await FoodRepository.getFoodName({ name: input.name });

        if (food.length) {
          const [existsFood] = food;
          logger.err('food already exists', food);
          return existsFood;
        }
        const newfood = await FoodRepository.post(input);
        return newfood;
      } catch (error) {
        logger.err('Error create food with GraphQL', error);
        return [];
      }
    },
    updateFood: async (_, { _id, input }) => {
      const client = await redis.getClient();
      const existsFoodbByName = await FoodRepository.getFoodName({ name: input.name });

      if (!Object.entries(input).length) {
        logger.err('food is a objet empty', input);
        return [];
      }

      if (existsFoodbByName.length) {
        logger.err('no repeat food name', existsFoodbByName);
        return existsFoodbByName;
      }

      try {
        const food = await FoodRepository.patch({ _id }, input, { new: true });
        client.del(_id);
        return food;
      } catch (error) {
        logger.err('Error get food by id GraphQL', error);
        return [];
      }
    },

    deleteFood: async (_, { _id }) => {
      const client = await redis.getClient();
      try {
        const foood = await FoodRepository.del(_id);
        client.del(_id);
        return foood;
      } catch (error) {
        logger.err('Error get food by id GraphQL', error);
        return [];
      }
    },
  },
};

module.exports = resolvers;
