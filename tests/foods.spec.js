const { initialFoods, newFood, api, mongoose, redis, getAllContentFromFoods } = require('./helpers');
const { Food } = require('../src/models');

beforeEach(async () => {
  await Food.deleteMany({});
  for (const food of initialFoods) {
    const foodObj = new Food(food);
    foodObj.save();
  }
});

describe(' GET FOODS', () => {
  test('should repond with 200 status code', async () => {
    await api
      .get('/api/v1/foods')
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('should repond with 200 with an array', async () => {
    const response = await api.get('/api/v1/foods');
    expect(response.body.foods).toHaveLength(initialFoods.length);
  });
});

describe('GET FOOD BY ID', () => {
  test('should repond with 200 status code', async () => {
    const { response: responseAll } = await getAllContentFromFoods();
    const {
      body: { foods },
    } = responseAll;
    const [food] = foods;
    await api
      .get(`/api/v1/foods/${food._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body.food.name).toBe(food.name);
      });
  });
});

describe('UPDATE FOOD', () => {
  test('should repond with 201 status code', async () => {
    const { response: responseAll } = await getAllContentFromFoods();
    const {
      body: { foods },
    } = responseAll;
    const [food] = foods;
    const updateName = {
      name: 'Panqueque',
    };
    await api
      .patch(`/api/v1/foods/${food._id}`)
      .send(updateName)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const { names } = await getAllContentFromFoods();
    expect(names).toContain(updateName.name);
  });
});

describe(' POST FOOD', () => {
  test('should repond with 201 status code', async () => {
    await api
      .post('/api/v1/foods')
      .send(newFood)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const { names, response } = await getAllContentFromFoods();

    expect(response.body.foods).toHaveLength(initialFoods.length + 1);
    expect(names).toContain(newFood.name);
  });
});

describe(' DELETE FOOD', () => {
  test('should repond with 201 status code', async () => {
    const { response: responseAll } = await getAllContentFromFoods();
    const {
      body: { foods },
    } = responseAll;
    const [foodToDelete] = foods;
    await api.delete(`/api/v1/foods/${foodToDelete._id}`).expect(200);

    const { names, response: responseOneDelete } = await getAllContentFromFoods();
    expect(responseOneDelete.body.foods).toHaveLength(initialFoods.length - 1);
    expect(names).not.toContain(foodToDelete.name);
  });
});

afterAll(async () => {
  const redisc = await redis.getClient();
  await mongoose.disconnect();
  await redisc.quit();
});
