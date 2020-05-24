const Job = require('../models/jobs');
const geoCoder = require('../utils/geocoder');

//Get all jobs => /api/v1/jobs
exports.getJobs = async (req, res, next ) => {
    const jobs = await Job.find();
    res.status(200).json({
        success: true,
        message : 'Jobs Controller ...',
        results: jobs.length,
        data:jobs
    });

}

//Create a new job => /api/v1/jobs/new
exports.newJob = async (req, res, next) => {
    console.log('Add New Job | Request Body : ');
    console.log(req.body);

    const jobs = await Job.create(req.body);
   
    res.status('200').json({
        success: true,
        message: 'Job Created',
        data: jobs
    })

}


//Search for jobs withing a city and radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
    console.log("Jobs Controller | getJobsInRadius");
    const { zipcode, distance } = req.params;

    //Getting latitude and longitude from geocoder
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;
    const radius = distance/ 3963;

    try{
        const jobs = await Job.find({
            location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
        });

        res.status(200).json({
            success: true,
            results: jobs.length,
            data: jobs
        });

    }catch(e){
        console.log("Jobs Controller | getJobsInRadius : " + e.message);
    }

}


//Update Job
exports.updateJob = async (req, res, next) => {
    try{
        let job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({
                success: false,
                message: 'Job not found.'
            });
        }
    
        job = await Job.findByIdAndUpdate(req.params.id,req.body);
    
        res.status(200).json({
            success: true,
            message : 'Job Updated Successfully',
            data: job
    });
   
    }catch(e){
        console.error('Update Job | error : '); 
        console.error(e.message);
    }
}


//Deleting a job => /api/v1/job/:id
exports.deleteJob = async (req, res, next) => {
    try{
        let job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({
                success: false,
                message: 'Job not found.'
            });
        }
    
        job = await Job.findByIdAndDelete(req.params.id,req.body);
    
        res.status(200).json({
            success: true,
            message : 'Job Deleted Successfully',
            data: job
    });
   
    }catch(e){
        console.error('Delete Job | error : '); 
        console.error(e.message);
    }
}