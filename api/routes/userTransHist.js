const express = require('express');
const app = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult, body, expressValidator } = require('express-validator');
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

//Database Configs
const db_config = {
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'bb3445d217854a',
    password: '11e0df20',
    database: 'heroku_3f1750c9c0f5c78',
    //port : '3306',
}

//Database credentials
// let db;
// function handleDisconnect() {
//   db = mysql.createConnection(db_config); // Recreate the connection, since
//                                                   // the old one cannot be reused.

//   db.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }
//     console.log("Transaction History Server Connection to Database Successful")                                    
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   db.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }

// handleDisconnect();

// db.connect((err)=>{
//     if(err) console.error(err);
//     console.log("Transaction History Server Connection to Database Successful")
// })
// TODO: 1) Get transaction data for user
//       2) Combine tables (Order & Order_Items) to respond back to user
//       
app.post('/', upload.none(), (req,res) => {
    //Assigned array object request to data variable
    const token = req.headers.authorization;
    const db = mysql.createConnection(db_config);
    console.log("Database connected for transaction");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Accept');
    res.setHeader('Access-Control-Allow-Credentials', false);

    jwt.verify(token, 'verysecretkey', (err, coded)=>{
        if(err){
            res.status(401).json({msg: "Please re-login/login"})
            console.error("Invalid Token: " + err);
            return;
        };
        //Valid Token 
        const decodedData = JSON.parse(JSON.stringify(coded));
        const userID = decodedData.userData.id;
        let transaction = getTransactionHistory(userID);
        
        transaction.then(d => {
            console.log(d);
            res.json(d);
            db.end();
        }).catch( err => {
            console.error(err);
            console.error("Unable to get transaction history");
            db.end();
        });
    
        
        
    })
    
})

function getTransactionHistory(userID){
    //TODO: Combine tables( Order & Order_Items & Products) and send it back to user;
    return new Promise((resolve, reject) => {
        db.query(`SELECT Orders.OR_ID, Orders.OR_DATE, Order_Items.PROD_ID, Order_Items.OI_Quantity, 
        Products.PROD_Name, Products.PROD_PRICE
        FROM Orders 
        INNER JOIN Order_Items 
        ON Order_Items.OR_ID=Orders.OR_ID AND Orders.CUS_ID = '${userID}'
        INNER JOIN Products ON Products.PROD_ID=Order_Items.PROD_ID;`, 
        (err, result) => {
        if(err) reject(err);
        result = JSON.parse(JSON.stringify(result));
        console.log("INSIDE QUERY: " + result);
        resolve(result);
        })  
    })
}

module.exports = app;