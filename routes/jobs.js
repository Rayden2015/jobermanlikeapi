const express = require('express');
const router = express.Router();

//Importing Jobs Controller
const { getJobs, newJob } =require('../controllers/jobsController');


//Assinging jobs controller to route
router.route('/jobs').get(getJobs);
router.route('/job/new').post(newJob);

module.exports = router;

