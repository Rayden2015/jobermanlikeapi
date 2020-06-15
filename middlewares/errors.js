const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    console.log("Errors Middleware");

    //General Error handling
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'development'){
        console.log('Development Mode');
        res.status(err.statusCode).json({
            success : false,
            error: err,
            errMessage : err.message || 'Internal Server Error',
            stack : err.stack
        });
     
    }

    if(process.env.NODE_ENV === 'production'){
        console.log('Production Mode');
        console.log(`Error name : ${err.name}`);
        let error = {...err};

        error.message = err.message;

        //Wrong Mongoose Object ID Error
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid ${err.path}`;
            error = new ErrorHandler(message, 404);
        }

        //Handling Mongoose Validation Error
        if(err.name === 'Validation Error'){
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        //Handle mangoose Duplicate key error
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered.`
            error = new ErrorHandler(message, 400);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error.'
        });

    }

   
}