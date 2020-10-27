const Joi = require('joi')

const  {StatusCodes} = require('http-status-codes') ;

const validateBody = (schema) {
    return (req, res, next) => {
        const validateResult = schema.validate(req.body);

        if(validateResult.error){
            res.status(StatusCodes.BAD_REQUEST).json(
                validateResult.error
            )
            return next();
        }else{
            return next()
        }
    }
}

const validateParam = (schema, name){

}

const schemas = {
    resigter: Joi.object().keys({
        firstname: Joi.string().min(2).required(),
        lastname: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    CMND: Joi.object().keys({
        param: Joi.string().min(9).max(12).required(),
    }),

    password: Joi.object().keys({
        param: Joi.string().min(6).required(),
    })
}

module.exports = {
    schemas, 
    validateBody
}