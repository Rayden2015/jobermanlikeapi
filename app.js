const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const errorMiddleware = require('./middlewares/errors');
const catchAsyncErrors = require('./middlewares/catchAsyncErrors');
const ErrorHandler =require('./utils/errorHandler');



//Middleware for Error handling
app.use(errorMiddleware);
 
//Setting up config env
dotenv.config({path: './config/config.env'})

//Handling Uncaught Exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception.');
    process.exit(1);
})

//Connecting to database
connectDatabase();

//Setup body parser
app.use(express.json());

//Handling Unhandled Routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//Setting up routes
const jobs = require('./routes/jobs');
app.use('/api/v1', jobs);



//Error Middleware
app.use(errorMiddleware);


//Creating own middleware
const middleware = (req, res, next) => {
    console.log('Hello from Middleware');
    req.user = 'Nurudin Lartey';
    next();
}
app.use(middleware);




//Starting Server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on ${process.env.PORT} and in ${process.env.NODE_ENV} mode.`);
});


//Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error : ${err.message}`);
    console.log('Shutting down the server due to handled promise rejection')
    server.close(() => {
        process.exit(1);
    })
})


// console.log(abcd);



