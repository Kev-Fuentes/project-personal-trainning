const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),
    price: Joi.number().min(1),
    type: Joi.string().valid('breakfast', 'lunch', 'dinner', 'fast food'),

})

module.exports = schema;