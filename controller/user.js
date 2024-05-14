const express = require("express");
const mysql = require("mysql");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const cookieparser = require("cookie-parser");
const { log } = require("console");
require("dotenv").config();
////////mysql connection////////
const db = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATA_BASE_NAME,
});
db.connect((err) => {
  if (err) {
    console.log("error to coonect database" + err);
    db.end();
    return;
  }
  console.log("conect to my sql");
});

//login//
exports.getlogin = (req, res, next) => {
  res.render("login");
};
exports.postlogin = async (req, res, next) => {
  try {
      const { email, password } = req.body;

      if (email && password) {
          db.query("SELECT * FROM users WHERE EMAIL=?", [email], async (err, result) => {
              if (err) {
                  console.error('Error fetching user from database:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              if (result.length <= 0) {
                  return res.render('login', { msg: 'Enter Correct Email & Password', red: 'red' });
              }
              
              const user = result[0];
              const isPasswordValid =  bcryptjs.compare(password, user.PASSWORD);
              if (isPasswordValid) {
                  const token = jwt.sign({ id: user.EMAIL }, process.env.JWT_SECRET, {
                      expiresIn: process.env.JWT_EXPIRES,
                  });

                  const cookieOptions = {
                      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                      httpOnly: true,
                  };

                  res.cookie('USERNAME', token, cookieOptions);
                  return res.status(200).redirect('/indexpage');
              } else {
                  return res.render('login', { msg: 'Incorrect password', red: 'red' });
              }
          });
      } else {
          return res.status(400).json({ error: 'Email and password are required' });
      }
  } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// register
exports.getregister = (req, res, next) => {
  res.render("register");
};
exports.postregister = async (req, res, next) => {
  const { username, email, password, c_password } = req.body;
  console.log(username, email, password, c_password);
  if ((username, email, password, c_password)) {
    db.query(
      "CREATE TABLE IF NOT EXISTS users (ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,USERNAME VARCHAR(255) NOT NULL,EMAIL VARCHAR(255) NOT NULL,PASSWORD  VARCHAR(255) NOT NULL)",
      (err) => {
        if (err) {
          console.log("cont create table" + err);
        }
        bcryptjs.hash(password, 8, (err, hpassword) => {
          if (err) {
            console.log();
          }
          console.log(hpassword);
          db.query(
            "select * from users where EMAIL=?",
            [email],
            (err, result) => {
              if (err) {
                console.log(err);
              }

              if (result.length <= 0) {
                db.query(
                  "insert into users (USERNAME,EMAIL,PASSWORD) VALUES(?,?,?)",
                  [username, email, hpassword],
                  (err, result) => {
                    if (err) {
                      console.log("cont insert data " + err);
                    }

                    return res.render("register", {
                      msg: "register success",
                      green: "success",
                      user: req.body,
                    });
                  }
                );
              } else {
                return res.render("register", {
                  msg: "Already exist This email",
                  green: "red",
                });
              }
            }
          );
        });
      }
    );
  }
};

// editpage
exports.getedit = (req, res, next) => {
  res.render("edit");
};

// indexpage
exports.indexpage = async (req, res, next) => {
console.log(req.cookies);

const data=req.cookies.USERNAME
if(data){
  const decode=await promisify(jwt.verify)(
    data,
    process.env.JWT_SECRET,
  );
  console.log(decode);
  const email = decode.id;
const sanitizedEmail = email.replace(/[@]/g, '');
let modifiedEmail = sanitizedEmail.slice(0, sanitizedEmail.indexOf(".com"));
  db.query(`CREATE TABLE IF NOT EXISTS \`${modifiedEmail}\` (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    NOTES VARCHAR(255) NOT NULL,
    TIME VARCHAR(255) NOT NULL,
    USERNAME VARCHAR(255) NOT NULL) `,(err)=>{
    if(err){
      console.log('error to create table '+err);
      return;
    }else{
      console.log(` ${modifiedEmail}   table creted succes`);
    }
  })
  db.query(`select * from \`${modifiedEmail}\``,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.status(200).render('indexpage',{msg:result})
    }
  })
}
else{
  res.render('login')
}
// next()

};

// adduserpage
exports.getadduser = (req, res, next) => {
  res.render("adduser");
};
exports.postadduser = async(req, res, next) => {

  const {title,message}=req.body
  console.log(title,message);
  let currentdate=new Date;
  let options = {
    timeZone: 'Asia/Kolkata', // Time zone for IST (Indian Standard Time)
    hour12: false, // Use 24-hour format
    weekday: 'long', // Display full weekday name
    year: 'numeric', // Display full year
    month: 'long', // Display full month name
    day: 'numeric', // Display day of the month
    hour: '2-digit', // Display hours with leading zeros
    minute: '2-digit', // Display minutes with leading zeros
    second: '2-digit' // Display seconds with leading zeros
  };
  
  let currentDateTime = currentdate.toLocaleDateString('en-IN',options)
if(title,message){
  db.query('insert into ')
}
};

exports.islogedin=async (req,res,next)=>{
  const cookie=req.cookies.USERNAME;
  if(!cookie){
    next()
  }else{
    res.status(200).redirect('indexpage')
  }
}