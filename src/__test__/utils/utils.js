const enumType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  FASTFOOT: 'fast food',
};

const builderFood = (id) => {
  return {
    _id: id,
    name: 'pizza',
    price: 2,
    available: true,
    type: enumType['FASTFOOT'],
  };
};

const idBuild = '718c12a6adeb13145f97bee8';
const idPost = '718c12a6adeb13145f97bae1';

const food = builderFood(idBuild);

const newFoodBuild = {
  name: 'Hamburgesa',
  price: 2,
  type: enumType['FASTFOOT'],
  available: true,
};

const updateFoodBuild = {
  name: 'Picada',
  price: 2,
  type: enumType['FASTFOOT'],
  available: true,
};

const resolvers = {
  find: async () => {
    return [food];
  },
  findById: async (id) => {
    const [filterFood] = [food].filter((food) => food._id === id);
    return filterFood;
  },

  save: async (entity) => {
    const newModel = {
      _id: idPost,
      ...entity,
    };
    return newModel;
  },
  findOneAndUpdate: async (id, entity) => {
    const [updateModel] = [food].map((food) => {
      if (food._id === id) {
        return {
          ...food,
          ...entity
        };

      }
    });

    return updateModel;
  },

  findOneAndDelete: async (id) => {
    const [deleteModel] = [food].filter((food) => food._id === id);
    return deleteModel;
  },
};

module.exports = {
  builderFood,
  resolvers,
  idBuild,
  newFoodBuild,
  updateFoodBuild,
  idPost,
};
