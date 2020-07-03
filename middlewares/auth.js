const jwt = require('jsonwebtoken');
const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');


//If check user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    let token ;
    console.log('Authorisation Middleware');

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        console.log('Token Found ' + token);
    }

    if(!token){
        return next (new ErrorHandler('Login first to access this resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
});


