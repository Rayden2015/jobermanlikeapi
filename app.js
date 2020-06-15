const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const errorMiddleware = require('./middlewares/errors');
const catchAsyncErrors = require('./middlewares/catchAsyncErrors');
const ErrorHandler =require('./utils/errorHandler');


//Setting up config env
dotenv.config({path: './config/config.env'});

//Connecting to database
connectDatabase();


//Setup body parser
app.use(express.json());


//Setting up routes
const jobs = require('./routes/jobs');
const auth = require('./routes/auth');
app.use('/api/v1', jobs);
app.use('/api/v1', auth);

//Middleware for Error handling
app.use(errorMiddleware);

 


//Starting Server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on ${process.env.PORT} and in ${process.env.NODE_ENV} mode.`);
});



//Handling Unhandled Routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});


// //Handling Uncaught Exceptions
process.on('uncaughtException', err => {
    console.log(`Error name : ${err.name}`);
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception.');
    process.exit(1);
});



// //Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error name : ${err.name}`);
    console.log(`Error : ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1);
    })
});

//Example of uncaught Error
//console.log(abcd); 



