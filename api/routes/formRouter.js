const express = require('express');
const app = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult, body } = require('express-validator');
/* Module for handling multipart bodies. IE: multipart/form-data (important)

        Multer adds a body object and a file or files object to the request object. 
        The body object contains the values of the text fields of the form, the file or files object contains 
        the files uploaded via the form.
*/
const multer = require('multer');
const upload = multer();
app.use(bodyParser.json());
app.use(morgan('short'));
const urlencodedParser = bodyParser.urlencoded({ extended : false});

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
    console.log("Database Connection Successful")
})

/***           SIGNUP   */
app.post('/signUp', upload.none(), [
    check('fname', "First Name must be alphabetical").isAlpha(),
    check('lname', "Last name must be alphabetical").isAlpha(),
    check('pw1', "Password must have at least 5 characters").isLength({min: 5}),
    body('email').custom((value)=>{
        let regex = /[@][a-zA-Z]+[.]com/g;
        if(value.match(regex)){
            return true;
        }
        throw new Error("Please use valid email address");
    }),
    body('pw1').custom((value, { req}) => {
        if(value !== req.body.pw2) {
            throw new Error('Password does not match');
        }
        return true;
    })
    
    ], (req,res,next) =>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
    }
    let errors = validationResult(req).formatWith(errorFormatter);
    let pw = req.body.pw1;

    uniqueEmail(req.body.email, db).then((message)=>{
        //Unique email
        if (!errors.isEmpty()) {
            console.log("SIGNUP ERRORS (unique email): " + JSON.stringify(errors));
            res.status(422).json(errors.array());
            return;
        } 
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(pw, salt, function(err, hash) {
                let {fname, lname, email} = req.body;
                let id = uuid();
                // Store hash in your password DB.
                if(err) throw err;
                db.query(`INSERT INTO Customer (CUS_ID, CUS_FName, CUS_LName, CUS_Email, CUS_PW) 
                        VALUES ('${id}', '${fname}', '${lname}', '${email}', '${hash}')`, 
                    (err)=> {
                        if(err) throw err;
                        console.log(`Sucessfully inserted Customer ${fname} ${lname}`);
                });
            })
        
        });
        res.status(200).json(['Successful Signup']);
    }).catch( async (err)=>{
        await errors.errors.push({
            value: `${req.body.email}`,
            msg: 'Email already in use. Please use another',
            param: 'email',
            location: 'MySQL' 
        })
        if (!errors.isEmpty()) {
            console.log("ERRORS (not unique email): " + JSON.stringify(errors));
            res.status(422).json(errors.array());
            return;
        } 
    })
})
/***           LOGIN  */
app.post('/login', upload.none(), [
    //Check if the email has correct format
    body('email').custom((value)=>{
        let regex = /[@][a-zA-Z]+[.]com/g;
        if(value.match(regex)){
            return true;
        }
        throw new Error("Please use valid email address format");
    })
], (req,res,next) =>{
    const errorFormatter2 = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
    }
    checkUser(req.body.email, req.body.pw, db).then((msg)=>{
        //Found email
        console.log(msg);
        res.status(200).json(['Successfully Logged In']);
    }).catch((err)=>{
        //No Email
        console.log(err);
        let errors = validationResult(req).formatWith(errorFormatter2);
        errors.errors.push({
            value: `${req.body.email}`,
            msg: `${err}`,
            param: 'email',
            location: 'MySQL' 
        });
        console.log("LOGIN ERRORS: " + JSON.stringify(errors));
        res.status(422).json(errors.array());
    })
    
    // if (!errors.isEmpty()) {
    //     console.log("LOGIN ERRORS : " + JSON.stringify(errors));
    //     res.status(422).json(errors.array());
    //     return;
    // } else{
    //     res.status(200).json({msg: "Successfully Logged In"});
    // }
})
function checkUser(email, pw, db){
    return new Promise( (resolve, reject) => {
        db.query(`SELECT * FROM Customer WHERE CUS_Email='${email}'`, (err, result)=>{
            let data;
            if(err) throw err;

            result = JSON.stringify(result);
            data = JSON.parse(result);
            if(data.length > 0){
                //Found Email, now check for password
                //If false, pw does not match. True if match
                let hashPW = data[0]['CUS_PW'];
                if( bcrypt.compareSync(pw, hashPW)){
                    resolve("Correct user credentials")
                }
                reject("Invalid Password");
            } else {
                reject("No Email Found");
            }
        })
    })
}
function uniqueEmail(email, db){
    return new Promise( (resolve, reject) => {
        db.query(`SELECT * FROM Customer WHERE CUS_Email='${email}'`, (err, result)=>{
            let data;
            if(err) throw err;

            result = JSON.stringify(result);
            data = JSON.parse(result);

            if(data.length > 0){
                reject("Not Unique Email")
            } else {
                resolve("Unique Email")
            }
        })
    })
}

module.exports = app;