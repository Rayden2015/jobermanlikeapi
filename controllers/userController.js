const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const errorHandler = require('../utils/errorHandler');
const ErrorHandler = require('../utils/errorHandler');
const { user } = require('../routes/user');
const sendToken = require('../utils/jwtToken');


//Get current user profile => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async(req,res, next) => {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            //data: user
            data: req.user
        })
});

//Update current password
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //check user's previous password
    const isMatched =  await user.comparePassword(req.body.currentPassword);

    if(!isMatched){
        return next(new ErrorHandler('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    })
});