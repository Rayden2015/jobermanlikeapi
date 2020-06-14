const Job = require('../models/jobs');
const geoCoder = require('../utils/geocoder');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');


//Get all jobs => /api/v1/jobs
exports.getJobs = async (req, res, next ) => {

    const apiFilters = new APIFilters(Job.find(), req.query)
            .filter()
            .sort()
            // .limitFields()
            // .searchByQuery()
            .pagination();
    
    //const jobs = await Job.find();
    const jobs = await apiFilters.query;

    res.status(200).json({
        success: true,
        message : 'Jobs Controller ...',
        results: jobs.length,
        data:jobs
    });

}

//Create a new job => /api/v1/jobs/new
exports.newJob = catchAsyncErrors ( async (req, res, next) => {

    const job = await Job.create(req.body);
    res.status('200').json({
        success: true,
        message: 'Job Created',
        data: job
    });

    }
);


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
        let job =  await Job.findById(req.params.id);
    
        if(!job){
            return next (new ErrorHandler('Job not found', 404));
        }
    
        job = await Job.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
    
        res.status(200).json({
            success: true,
            message : 'Job Updated Successfully',
            data: job
        }); 
   
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


//Getting a single job with id and slug => /api/v1/job/:id/:slug
exports.getJob = async (req, res, next) => {
  
        const job = await Job.findById(req.params.id);

        if(!job){
            return res.status(404).json({
                success: false,
                message: 'Job not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job found',
            data: job
        });
  
}



//get statistics abooout a topic(job)  => /api/v1/stats/:topic
exports.jobStats = async (req, res, next) => {
    try{
        const stats = await Job.aggregate([
            {
                $match : {$text : {$search : "\"" + req.params.topic + "\""}}
            },
            {
                $group: {
                    //_id: null,
                    _id:                {$toUpper: '$experience'},
                    totalJobs:          {$sum:  1},
                    totalPositions:     {$sum: '$positions'},
                    avgPosition:        {$avg: '$positions'},
                    avgSalary :         {$avg: '$salary'},
                    minSalary :         {$min: '$salary'},
                    maxSalary:          {$max: '$salary'}
                }
            }
        ]);

        if(stats.length === 0){
            return next(new ErrorHandler(`Stats found for - ${req.params.topic}`, 404));
            // return res.status(404).json({
            //     success: false,
            //     message: `No stats found for - ${req.params.topic}`
            // });
        }
    
        res.status(400).json({
            success: true,
            message: `Stats found for - ${req.params.topic}`,
            data: stats
        });

    }catch(e){
        console.error("JobStats Error : "+ e.message);
    }
    

    

}