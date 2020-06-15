const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//Register a new user ==> /api/v1/user/register

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password, role} = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    res.status(200).json({
        succes: true,
        message: 'User created succesfully',
        data: user
    })
});