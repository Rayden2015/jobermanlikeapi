const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const errorMiddleware = require('./middlewares/errors');
const catchAsyncErrors = require('./middlewares/catchAsyncErrors');



//Middleware for Error handling
app.use(errorMiddleware);
 
//Setting up config env
dotenv.config({path: './config/config.env'})

//Connecting to database
connectDatabase();

//Setup body parser
app.use(express.json());

//Setting up routes
const jobs = require('./routes/jobs');
app.use('/api/v1',jobs);

//Error Middleware
app.use(errorMiddleware);


//Creating own middleware
const middleware = (req, res, next) => {
    console.log('Hello from Middlware');
    req.user = 'Nurudin Lartey';
    next();
}
app.use(middleware);




//Starting Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on ${process.env.PORT} and in ${process.env.NODE_ENV} mode.`);
});



