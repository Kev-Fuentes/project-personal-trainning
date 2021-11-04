

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

const getAllContentFromFoods = async () => {
  const response = await api.get('/api/v1/foods');
  const names = response.body.foods.map((food) => food.name);
  return {
    response,
    names,
  };
};

module.exports = {
  initialFoods,
  newFood,
  api,
  getAllContentFromFoods,
};
