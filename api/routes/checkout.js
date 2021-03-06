const express = require('express');
const app = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql');
const jwt = require("jsonwebtoken");
const cookieSession = require('cookie-session');

/* Module for handling multipart bodies. IE: multipart/form-data (important)

        Multer adds a body object and a file or files object to the request object. 
        The body object contains the values of the text fields of the form, the file or files object contains 
        the files uploaded via the form.
*/
const multer = require('multer');
const upload = multer();

// app.use(bodyParser.json());
app.use(morgan('short'));
app.use(cookieSession({
    name: 'session',
    secret : 'verysecret',
    secure : false,
    httpOnly : false,
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

bodyParser.urlencoded({ extended : false});

process.env.SECRET_KEY = "secret";


// //Express Session Middleware
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

//Express Message Middleware
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });


//Database Configs
const db_config = {
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'bb3445d217854a',
    password: '11e0df20',
    database: 'heroku_3f1750c9c0f5c78',
    //port : '3306',
}

//Database credentials
// const db = mysql.createConnection({
//     host: 'us-cdbr-iron-east-05.cleardb.net',
//     user: 'bb3445d217854a',
//     password: '11e0df20',
//     database: 'heroku_3f1750c9c0f5c78',
//     port: '3306'
// });

// db.connect((err)=>{
//     if(err) throw err;
//     console.log("Checkout Server Connection to Database Successful")
// })
app.post('/', upload.none(), (req,res) => {
    //Assigned array object request to data variable
    const checkoutItems = req.body;
    const token = req.headers.authorization;
    jwt.verify(token, 'verysecretkey', (err, coded)=>{
        if(err){
            res.status(401).json({msg: "Please re-login/login"})
            console.log("Invalid Token: " + err);
            return;
        };
        console.log("Valid Token" );
        const decodedData = JSON.parse(JSON.stringify(coded));
        const userID = decodedData.userData.id;
        createOrder(res, userID, checkoutItems);
    })
    
})

function createOrder(res, userID, data){
    try{
        let db = mysql.createConnection(db_config);
        db.query(`INSERT INTO Orders ( CUS_ID, OR_Date) VALUES ( '${userID}', '${getDate()}')`, 
            (err, result) => {
                if(err) throw err;
                let orderID = result.insertId;
                data.forEach(obj =>{
                    try {
                        console.log(obj);
                        db.query(`INSERT INTO Order_Items ( OR_ID, PROD_ID, OI_Quantity, OI_Price) VALUES ( '${orderID}', '${obj.id}' , '${obj.quantity}', '${obj.price}')` , 
                            (err, result) => {
                                if(err) throw err;
                            })
                        res.json({msg : "Successful purchase"});
                    } catch(err){
                        console.log("Order Items insert error")
                        console.error(err);
                    }
                })
        })
        db.end();
    }  catch(err){
        db.end();
        console.error(err);
    }
}

function getDate(){
    let date = new Date();
    let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                        .toISOString()
                        .split("T")[0];
    return dateString;
}

module.exports = app;