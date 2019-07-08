const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const PORT = process.env.PORT || 5000;


// const flash = require('connect-flash');
// const session = require('express-session');

/**
 *      app.use(bodyParser.json()) basically tells the system that you want json to be used.
 * 
        bodyParser.urlencoded({extended: ...}) basically tells the system whether you want to use a 
        simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that 
        can deal with nested objects (i.e. true).
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
// app.use(expressSession({secret: "cat", saveUninitialized: false, resave: false}));
app.use(morgan('short'));
app.use(express.static('./public')); 

//Routes
const formRouter = require('./api/routes/formRouter');
app.use(formRouter)


console.log("ON APP *******")
app.get('/', (req,res,next) =>{
    res.sendFile(path.join(__dirname + '/public/index.html'));
    res.end();
})


//Handles request errors
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

app.listen(PORT, ()=> {
    console.log( `APP: Server running on ${PORT}`);
})

module.exports = app;