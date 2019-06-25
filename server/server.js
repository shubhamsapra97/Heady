const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const http = require('http');

const routes = require('./api/routes/route');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

//DB config
let uri = 'Enter URI HERE!!';
//connect to mongodb
mongoose.connect(uri,
    { useNewUrlParser: true },
    function(error) {
        console.log(`ERRORS in connecting to DB: ${error}`);
    }
);

const port = process.env.PORT || 1111;
let app = express();
let server = http.createServer(app);

//body-parser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// CORS config
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//API ROUTES 
app.use(routes);

// Connect to server
server.listen(port,()=>{
   console.log(`Server is up on port ${port}`); 
});