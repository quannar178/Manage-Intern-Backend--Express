const Joi = require("joi");

const  {StatusCodes} = require('http-status-codes') ;


const validateBodySalary = (schema) => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body);

    if (validateResult.error) {
      res.status(StatusCodes.BAD_REQUEST).json(validateResult.error);
      return next();
    } else {
      return next();
    }
  };
};

const schemasSalary = {
  schemaSalary: Joi.object().keys({
    idUser: Joi.number().required(),
    month: Joi.number().min(1).max(12).required(),
    salary: Joi.number().required(),
  }),
};

module.exports = {
  schemasSalary,
  validateBodySalary,
};
