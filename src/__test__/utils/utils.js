const enumType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  FASTFOOT: 'fast food',
};

const builderFood = (id) => {

  return {
    id,
    name: 'pizza',
    price: 2,
    available: true,
    type: enumType['FASTFOOT'],
  }
};
const idBuild = '718c12a6adeb13145f97bee8'
const food = builderFood(idBuild)


function Food() {


  this.save = () => { }


  return {
    find: async () => {
      return food;
    },
    findById: async (id) => {
      const [filterFood] = [food].filter(food => food.id === idBuild)
      return filterFood;
    },

    post: async (entity) => {
      const newModel = {
        _id: '718c12a6adeb13145f97bae1',
        ...entity
      }
      return newModel;

    },
    findOneAndUpdate: async (id, entity) => {

      const updateModel = [food].map((food) => {
        if (food.id === idBuild) {
          return { ...food, ...entity };
        }
      })
      return updateModel;
    },

    findOneAndDelete: async (id) => {
      const [deleteModel] = [food].filter((food) => food.id !== idBuild);
      return deleteModel;
    },
  }

}


module.exports = {
  builderFood,
  Food,
  idBuild
};
