const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Pleae enter your name']
    },
    email:{
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    role: {
        type: String,
        enum:{
            values: ['user', 'employer'],
            message : 'Please select your role'
        },
        //required: [true, 'Please select role that is required'],
        default: 'user'
    },
    password :{
        type: String,
        required: [true, 'Please enter password for your account'],
        minlength: [8, 'Your password must be a t leeast 8 characters long'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

//Encryting Passwords before Saving
userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10);
});

//Return JSON web token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//Compare password in database
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
}

//Generate password reset token
userSchema.methods.resetPasswordTokens = function(){
    //Generate password token
    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Models | users | resetPassword Token | resetToken : '+resetToken);

    //Hash and  set to resetPasswordToken
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    console.log('Models | users | resetPassword Token | resetPasswordToken : ');
    console.log(resetPasswordToken);

    //Set token expire time
    this.resetPasswordExpire = Date.now() + 30*60*1000;

    return resetToken;

}

module.exports = mongoose.model('User', userSchema);