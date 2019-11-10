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

//Database credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'clothing_DB',
    port: '3306'
});

db.connect((err)=>{
    if(err) throw err;
    console.log("Transaction History Server Connection to Database Successful")
})
// TODO: 1) Get transaction data for user
//       2) Combine tables (Order & Order_Items) to respond back to user
//       
app.post('/', upload.none(), (req,res) => {
    //Assigned array object request to data variable
    const token = req.headers.authorization;
    jwt.verify(token, 'verysecretkey', (err, coded)=>{
        if(err){
            res.status(401).json({msg: "Please re-login/login"})
            console.log("Invalid Token: " + err);
            return;
        };
        //Valid Token 
        const decodedData = JSON.parse(JSON.stringify(coded));
        const userID = decodedData.userData.id;
        let transaction = getTransactionHistory(userID);
        
        transaction.then(d => {
            res.json(d);
        }).catch( err => console.err(err));
    
        
        
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
        resolve(result);
        })  
    })
}

module.exports = app;