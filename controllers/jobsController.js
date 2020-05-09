//Get all jobs => /api/v1/jobs
exports.getJobs = (req, res, next ) => {
    res.status(200).json({
        success: true,
        middlwareUser: req.user,
        message : 'Jobs Controller ...'
    });

}