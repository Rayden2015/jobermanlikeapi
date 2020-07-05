const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

//Register a new user ==> /api/v1/user/register

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password, role} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendToken(user, 200, res);
});



//Loguin user => /api/v1/login
exports.loginUser = catchAsyncErrors( async(req, res, next) =>{
    const { email, password } = req.body;

    if(!email || !password){
        return next (new ErrorHandler('Please enter email and password'), 400);
    }

    //Finding user in database
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    //Check if passwoerd is correct
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next (new ErrorHandler('Invalid Email or Password', 401));
    }

    //Create JSON Web Token
    sendToken(user,200, res);

});


//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req,res, next) => {
        const user = await User.findOne({email: req.body.email});
        
        //Check if user email exists in database
        if(!user){
            return next (new ErrorHandler('No user found with this email'), 404);
        }

        const resetToken = user.getResetPasswordToken();

        await user.save({validateBeforeSave: false});
});