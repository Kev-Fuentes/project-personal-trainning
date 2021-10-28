


const findValidation = async ({ model, obj, attr }) => {
    const existsFood = await model.find({ [attr]: obj[attr] });
    return existsFood.length ? true : false

}


module.exports = findValidation;