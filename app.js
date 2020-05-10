const express = require('express');
const app = express();


//Setting up config env
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});

//Connecting to database
const connectDatabase = require('./config/database');
connectDatabase();

//Setup body parser
app.use(express.json());


//Creating own middleware
const middleware = (req, res, next) => {
    console.log('Hello from Middlware');
    req.user = 'Nurudin Lartey';
    next();
}

app.use(middleware);


//Setting up routes
const jobs = require('./routes/jobs');
app.use('/api/v1',jobs);

//Starting Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on ${process.env.PORT} and in ${process.env.NODE_ENV} mode.`);
});



