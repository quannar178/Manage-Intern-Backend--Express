const Joi = require('joi')

const  {StatusCodes} = require('http-status-codes') ;

const validateBody = (schema) => {
    return (req, res, next) => {
        console.log(req.body);
        const validateResult = schema.validate(req.body);

        if(validateResult.error){
            res.status(StatusCodes.BAD_REQUEST).json(
                validateResult.error
            )
            return next(validateResult.error);
        }else{
            return next()
        }
    }
}

const schemas = {
    project: Joi.object().keys({
        name: Joi.string().min(2).required(),
        description: Joi.string().min(2).required(),
        deadline: Joi.date()
    }),

    // projectId: Joi.object().keys({
    //     id: Joi.number().required()
    // })
}
module.exports = {
    schemas, 
    validateBody
}