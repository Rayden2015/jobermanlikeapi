const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

module.exports = mongoose.model('User', userSchema);