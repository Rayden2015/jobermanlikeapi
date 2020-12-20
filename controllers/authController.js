const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto');

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
    // const isPasswordMatched = await user.comparePassword(password);

    // if(!isPasswordMatched){
    //     return next (new ErrorHandler('Invalid Email or Password', 401));
    // }

    //Create JSON Web Token
    sendToken(user,200, res);

});


//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req,res, next) => {
        console.dir(req.body);
        const user = await User.findOne({email: req.body.email});
        
        //Check if user email exists in database
        if(!user){
            return next (new ErrorHandler('No user found with this email'), 404);
        }

        const resetToken = user.getResetPasswordToken();
        console.log('authController | forgotPassword | resetToken : '+resetToken);

        //await user.save({validateBeforeSave: false});
        return 'true';
});

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next)=> {
    //Hash url token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        return next(new ErrorHandler('Password Reset token is invalid'), 400);
    }

    //Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async(req,res,next)=> {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success : true,
        message : 'Logged out succesfully'
    });
})
