const Job = require('../models/jobs');

//Get all jobs => /api/v1/jobs
exports.getJobs = (req, res, next ) => {
    res.status(200).json({
        success: true,
        middlwareUser: req.user,
        message : 'Jobs Controller ...'
    });

}

//Create a new job => /api/v1/jobs/new
exports.newJob = async (req, res, next) => {
    console.log('Add New Job | Request Body : ');
    console.log(req.body);

    const job = await Job.create(req.body);
   
    res.status('200').json({
        success: true,
        message: 'Job Created',
        data: job
    })

}