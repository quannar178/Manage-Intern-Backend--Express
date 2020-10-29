const Joi = require("joi");

const { StatusCodes } = require("http-status-codes");

const validateBodySchedule = (schema) => {
  return (req, res, next) => {
    console.log(req.body);
    req.body.schedule.forEach((element) => {
      const validateResult = schema.validate(element);
      if (validateResult.error) {
        res.status(StatusCodes.BAD_REQUEST).json(validateResult.error);
        return next(validateResult.error);
      }
    });
    return next();
  };
};

const schemasSchedule = {
  schemaPerDayDraft: Joi.object().keys({
    date: Joi.date().required(),
    draft: Joi.string().valid("M", "A", "F", "O"),
  }),
  schemaPerDayPublic: Joi.object().keys({
    date: Joi.date().required(),
    publicSche: Joi.string().valid("M", "A", "F", "O"),
  }),

  // projectId: Joi.object().keys({
  //     id: Joi.number().required()
  // })
};
module.exports = {
  schemasSchedule,
  validateBodySchedule,
};