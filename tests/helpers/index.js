const enumType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  FASTFOOT: 'fast food',
};

const initialFoods = [
  {
    name: 'Pizza',
    price: 2,
    type: enumType['FASTFOOT'],
  },
  {
    name: 'Hamburgesa',
    price: 2,
    type: enumType['FASTFOOT'],
  },
];

const newFood = {
  name: 'Asado',
  price: 2,
  type: enumType['LUNCH'],
};



module.exports = {
  initialFoods,
  newFood,
};
