const User = require("../models/users");
const Job = require("../models/jobs");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const errorHandler = require("../utils/errorHandler");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const fs = require('fs');

//Get current user profile => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "userJobsPublished",
    select: "title postingDate",
  });

  res.status(200).json({
    success: true,
    //data: user
    data: req.user,
  });
});

//Update current password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check user's previous password
  const isMatched = await user.comparePassword(req.body.currentPassword);

  if (!isMatched) {
    return next(new ErrorHandler("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

//Update current user data => /api/v1/me/update
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  console.log("userController | updateUser | " + req.user);
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//Delete user data => /api/v1/me/delete
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  deleteUserData(req.user.id, req.user.role);
  
  await User.findByIdAndDelete(req.user.id);
  console.log("userController | deleteUser | " + req.user);

  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User Deleted Succesfully",
  });
});

//Delete related user data : jobs
async function deleteUserData(user, role) {
  console.log('userController | deleteUserData() ');
  if (role === "employer") {
    await Job.deleteMany({ user: user });
  }

  if (role === "user") {
    const appliedJobs = await Job.find({ 'applicantsApplied.id': user }).select('+applicantsApplied');

    console.log('Applied Jobs per current user : ');
    console.dir(appliedJobs.doc);
    console.log('Count of appliedJobs : ' +appliedJobs.length );

    for(let i=0; i<appliedJobs.length; i++){
        let obj = appliedJobs[i].applicantsApplied.find(o => o.id === user);

        console.dir('Jobs Applied per Current User : ');
        console.dir(obj);

        let filepath = `${__dirname}/public/uploads/${obj.resume}`.replace('controllers/', '');
         console.log(`File Path : ${filepath}`);
        fs.unlink(filepath, err => {
            if(err) return console.log(err);
        });

        console.log('appliedJobs[i].applicantsApplied.indexOf(obj.id) : ' + appliedJobs[i].applicantsApplied.indexOf(obj.id));

        //appliedJobs[i].applicantsApplied.splice(0);

        appliedJobs[i].applicantsApplied.splice(appliedJobs[i].applicantsApplied.indexOf(obj.id, 1));
        appliedJobs[i].save();

        console.log('Applied Jobs afer splicing');
        console.dir(appliedJobs[0].applicantsApplied);

        const months = ['Jan', 'March', 'April', 'June'];
        console.dir(months);
        months.splice(2,1);
        console.log('Months : ');
        console.dir(months);
    }
  }
}


//Show all jobs applied => /api/v1/jobs/applied