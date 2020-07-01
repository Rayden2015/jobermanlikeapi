class ErrorHandler extends Error {
    constructor(message, statusCode){
        //console.log("Error Handler Class");
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports =  ErrorHandler;

