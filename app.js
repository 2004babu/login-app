const express=require('express');
const path=require('path');
const hbs=require('hbs');
const mysql=require('mysql');
const dotenv=require('dotenv');
const cookieParse=require('cookie-parser');
const exp = require('constants');
const app=express();

dotenv.config();
const PORT=process.env.PORT;
const db=mysql.createConnection({
    host:process.env.HOSTNAME
    ,user:process.env.DB_USER,
    password:process.env.PASSWORD,
    database:process.env.DATA_BASE_NAME
});
db.connect((err)=>{
    if(err){
        console.log('error to coonect database'+err);
        db.end()
        return;

    }
    console.log('conect to my sql');

});
app.use(express.static(path.join(__dirname,'puplic')));
app.use(cookieParse())
app.use(express.urlencoded({extended:false}))
app.set("view engine","hbs");
hbs.registerPartials(path.join(__dirname,'./views/partials'))
app.use('/',require('./router/pages'))
app.listen(PORT,(err)=>{
    if(err){
    console.log(err);}
    console.log('POrt Running In '+PORT);
});

