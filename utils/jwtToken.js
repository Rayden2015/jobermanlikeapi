//Create, send token, and save in cookie
const sendToken = (user, statusCode, res, req) => {
    //create JWTToken
    const token = user.getJwtToken();

    //Options for Cookie
    const options = {
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24*60*60*1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
           success: true,
           token
       });

}


module.exports = sendToken;

