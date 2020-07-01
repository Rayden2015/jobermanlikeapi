const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

//Register a new user ==> /api/v1/user/register

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password, role} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    //Create JWT Token
    const token = user.getJwtToken();

    res.status(200).json({
        succes: true,
        message: 'User created succesfully',
        data: user,
        token: token
    })
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

    //Create JSOBN Web Token
    const token = user.getJwtToken();

    res.status(200).json({
        succes: true,
        token
    })

})