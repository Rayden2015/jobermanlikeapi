const express = require('express');
const router = express.Router();

//Importing Jobs Controller
const { getJobs, newJob, getJobsInRadius, updateJob, deleteJob } =require('../controllers/jobsController');


//Assinging jobs controller to route
router.route('/jobs').get(getJobs); //Getting all jobs
router.route('/job/new').post(newJob); //Creating new job
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius); //searching for jobs withing a radius of a zipcode
router.route('/job/:id')
        .put(updateJob)
        .delete(deleteJob);



module.exports = router;

