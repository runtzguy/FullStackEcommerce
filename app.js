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
// app.use(express.static('./public')); 

//Load View Engine
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'pug')


//Routes
const userRouter = require('./api/routes/user');
const checkoutRouter = require('./api/routes/checkout');
const transHistRouter = require('./api/routes/userTransHist');

// app.use((res, next) => {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'POST');
    
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', false);

//     // Pass to next layer of middleware
//     next();
// });

// app.use((res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Request-Method', 'POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', false);
//     next();
// })
app.use('/userTransHist', transHistRouter)
app.use('/user', userRouter)
app.use('/checkout', checkoutRouter)


console.log("ON APP *******") 

app.use("/", res => {
    console.log("Responding to root route");
})

app.listen(PORT, ()=> {
    console.log( `APP: Server running on ${PORT}`);
})
module.exports = app;