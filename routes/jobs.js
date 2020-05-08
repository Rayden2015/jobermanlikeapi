const express = require('express');
const router = express.Router();

//Importing Jobs Controller
const { getJobs } =require('../controllers/jobsController');

//Assinging jobs controller to route
router.route('/jobs').get(getJobs);

module.exports = router;

