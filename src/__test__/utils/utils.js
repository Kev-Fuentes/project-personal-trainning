const enumType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  FASTFOOT: 'fast food',
};


const dataPagination = [
  {
    _id: 1,
    name: 'hot dog',
    price: 2,
    available: true,
    type: enumType['FASTFOOT'],
  },
  {
    _id: 2,
    name: 'pizza',
    price: 2,
    available: true,
    type: enumType['FASTFOOT'],
  }
  ,
  {
    _id: 3,
    name: 'hamburguesa',
    price: 2,
    available: true,
    type: enumType['FASTFOOT'],
  }
  ,
  {
    _id: 4,
    name: 'wafles',
    price: 3,
    available: true,
    type: enumType['FASTFOOT'],
  }
  , {
    _id: 5,
    name: 'salchi papas',
    price: 2,
    available: true,
    type: enumType['FASTFOOT'],
  }
  , {
    _id: 6,
    name: 'alistas con papa',
    price: 4,
    available: true,
    type: enumType['FASTFOOT'],
  }
  , {
    _id: 7,
    name: 'arepa de huevo',
    price: 2,
    available: true,
    type: enumType['FASTFOOT'],
  }
  , {
    _id: 8,
    name: 'empanadas',
    price: 1,
    available: true,
    type: enumType['FASTFOOT'],
  }
  , {
    _id: 9,
    name: 'arroz chino',
    price: 3,
    available: true,
    type: enumType['FASTFOOT'],
  }
  , {
    _id: 10,
    name: 'asado',
    price: 4,
    available: true,
    type: enumType['FASTFOOT'],
  }


]

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
  dataPagination
};
