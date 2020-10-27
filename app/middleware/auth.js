const { StatusCodes } = require("http-status-codes");


const checkAdmin = async (req, res, next) => {
    if(req.user.role === "admin"){
        next();
    }else{
        res.status(StatusCodes.FORBIDDEN).json({
            message: "require role admin"
        })
        next();
    }
}

module.exports = checkAdmin