const enumType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  FASTFOOT: 'fast food',
};

const initialFoods = [
  {
    id: '618c12a6adeb13145f97bee8',
    name: 'Pizza',
    price: 2,
    type: enumType['FASTFOOT'],
  },
  {
    id: '718c12a6adeb13145f97bee8',
    name: 'Hamburgesa',
    price: 2,
    type: enumType['FASTFOOT'],
  },
];

const createInitialFood = [...initialFoods];

const deleteInitialFood = [...initialFoods];

const newFood = {
  name: 'Asado',
  price: 2,
  type: enumType['LUNCH'],
};

module.exports = {
  initialFoods,
  newFood,
  createInitialFood,
  deleteInitialFood,
};
