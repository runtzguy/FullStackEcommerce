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
const flash = require("connect-flash");
/* Module for handling multipart bodies. IE: multipart/form-data (important)

        Multer adds a body object and a file or files object to the request object. 
        The body object contains the values of the text fields of the form, the file or files object contains 
        the files uploaded via the form.
*/
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json());
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
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

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
   //FORMAT OF TOKEN
   //Authorization : Bearer <access_token>

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
    ],
    (req,res,next) =>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
    }
    let errors = validationResult(req).formatWith(errorFormatter);
    let pw = req.body.pw1;


    uniqueEmail(req.body.email, db).then((message)=>{
        //Unique email
        if (!errors.isEmpty()) {
            console.log("SIGNUP ERRORS (unique email): " + JSON.stringify(errors));
            res.json(errors);
            return
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
        res.status(200).json({msg:'Successful Signup'});
    }).catch( async (err)=>{
        await errors.errors.push({
            msg: 'Email already in use. Please use another',
        })
        if (!errors.isEmpty()) {
            console.log("ERRORS (not unique email): " + JSON.stringify(errors));
            res.json(errors);
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
    })],
    (req,res,next) =>{
    const errorFormatter2 = ({msg}) => {
        return `${msg}`;
    }
    console.log(req.body);
    checkCred(req.body.email, req.body.pw, db)
    .then((d)=>{
        //Found email
        const userData = {...d}
        //JWT returns a promise so response must be put inside.
        jwt.sign({userData}, 'verysecretkey', {expiresIn : '1h'}, (err, token) =>{
            if(err) {
                console.log(" JWT Error: "+err);
                throw err
            };
            //Set token to be sent to client
            req.session.jwt = token;
            res.json(
                {
                    fName : userData['fName'],
                    lName : userData['lName'],
                    isLoggedIn : true
                }
            );
        })
        // res.status(200).json({message: 'Successfully Log In'});
        console.log(req.protocol + '://' + req.get('host') + '/layouts/account');
    })
    .catch((err)=>{
        //No Email
        let errors = validationResult(req).formatWith(errorFormatter2);
        errors.errors.push(err);
        console.log("LOGIN ERRORS: " + JSON.stringify(errors));
        res.status(406);
        res.json(errors);
        // res.redirect().json(errors.array());
    })
    
    // if (!errors.isEmpty()) {
    //     console.log("LOGIN ERRORS : " + JSON.stringify(errors));
    //     res.status(422).json(errors.array());
    //     return;
    // } else{
    //     res.status(200).json({msg: "Successfully Logged In"});
    // }
})
function checkCred(email, pw, db){
    return new Promise( (resolve, reject) => {
        db.query(`SELECT * FROM Customer WHERE CUS_Email='${email}'`, (err, result)=>{
            let data;
            if(err) throw err;
            //Changes [object Object] into a readable string
            result = JSON.stringify(result);
            //Changes the string into JSON object
            data = JSON.parse(result);
            if(data.length > 0){
                //Found Email, now check for password
                //If false, pw does not match. True if match
                let hashPW = data[0]['CUS_PW'];
                if( bcrypt.compareSync(pw, hashPW)){
                    resolve({
                        id : data[0]['CUS_ID'],
                        fName : data[0]['CUS_FName'],
                        lName : data[0]['CUS_LName'],
                        email : data[0]['CUS_Email']
                    })
                }
                reject({msg :"Invalid Password"});
            } else {
                reject({ msg : "No Email Found"});
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
                reject({ msg: "Not Unique Email"})
            } else {
                resolve({msg: "Unique Email"})
            }
        })
    })
}
function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){

    }else {
        //Forbidden
        res.sendStatus(403);
    }
    next();
}

module.exports = app;