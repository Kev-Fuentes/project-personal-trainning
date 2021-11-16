require('../app');
const { stub } = require('sinon');
const { Food } = require('../models');
const { idBuild, newFoodBuild, builderFood, resolvers, idPost, updateFoodBuild } = require('./utils/utils');
const BaseRepository = require('../repositories/baseRepository');
const modelFood = BaseRepository(Food);
const food = builderFood(idBuild);

const find = stub(Food, 'find');
const findById = stub(Food, 'findById');
const findOneAndUpdate = stub(Food, 'findOneAndUpdate');
const post = stub(modelFood, 'post');
const findOneAndDelete = stub(Food, 'findOneAndDelete');

beforeEach(async () => {
  find.resolves(await resolvers.find());
  findById.withArgs(idBuild).returns(await resolvers.findById(idBuild));
  post.withArgs(newFoodBuild).returns(await resolvers.save(newFoodBuild));
  findOneAndUpdate
    .withArgs(idBuild, updateFoodBuild)
    .resolves(await resolvers.findOneAndUpdate(idBuild, updateFoodBuild));
  findOneAndDelete.withArgs(idBuild).resolves(await resolvers.findOneAndDelete(idBuild));
});

describe('BaseRepository', () => {
  describe('get', () => {
    it('get', async () => {
      const foods = await modelFood.get();
      expect(foods).toEqual(expect.arrayContaining([food]));
    });
  });

  it('getById', async () => {
    const food = await modelFood.getById(idBuild);
    expect(food).toEqual(expect.objectContaining(food));
  });

  it('post', async () => {
    const newFood = await modelFood.post(newFoodBuild);
    expect(newFood).toEqual(
      expect.objectContaining({
        _id: idPost,
        ...newFoodBuild,
      })
    );
  });

  it('patch', async () => {
    const updateFood = await modelFood.patch(idBuild, updateFoodBuild);
    expect(updateFood).toEqual(
      expect.objectContaining({
        _id: idBuild,
        ...updateFoodBuild,
      })
    );
  });

  it('delete', async () => {
    const food = await modelFood.del(idBuild);
    expect(food).toEqual(expect.objectContaining(food));
  });
});

afterEach(() => {
  find.resetHistory();
  findById.resetHistory();
  post.resetHistory();
  findOneAndUpdate.resetHistory();
  findOneAndDelete.resetHistory();
});
