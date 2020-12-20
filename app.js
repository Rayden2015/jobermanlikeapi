const express = require('express');
const Sentry = require('@sentry/node');
const app = express();

Sentry.init({ dsn: 'https://11ead0a432174cce8c8f58ebce7c3181@o292934.ingest.sentry.io/5304840' });

app.use(Sentry.Handlers.requestHandler());

const dotenv = require('dotenv');
const cookieParser  = require('./utils/errorHandler');
const fileUpload = require('express-fileupload');

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

//set Cookie Parse
//app.use(cookieParser());

//File upload
app.use(fileUpload());


//Setting up routes
const jobs = require('./routes/jobs');
const auth = require('./routes/auth');
const user = require('./routes/user');
app.use('/api/v1', jobs);
app.use('/api/v1', auth);
app.use('/api/v1', user);


app.get('debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
  });

//Middleware for Error handling
app.use(errorMiddleware);

 

app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });


app.use(Sentry.Handlers.errorHandler()); 

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



