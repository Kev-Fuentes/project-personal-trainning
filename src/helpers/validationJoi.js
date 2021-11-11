'use strict';
const validationJoi = (schema, obj) => {
  const validations = schema.validate(obj);
  const errors = validations.error?.details ?? false;
  return errors[0]?.message;
};

module.exports = validationJoi;
