'use strict';
const BaseRepository = (model) => {
  return {
    get: async () => {
      return await model.find();
    },
    getById: async (id) => {
      return await model.findById(id);
    },
    post: async (entity) => {
      const newModel = await new model(entity);
      await newModel.save();
      return newModel;
    },
    patch: async (id, entity) => {
      const updateModel = model.findOneAndUpdate(id, entity, { new: true });
      return updateModel;
    },

    del: async (id) => {
      const deleteModel = await model.findOneAndDelete(id);
      return deleteModel;
    },
  };
};

module.exports = BaseRepository;
