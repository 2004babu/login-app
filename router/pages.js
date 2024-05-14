const express=require('express')
const router=express.Router();
const controller=require('../controller/user')
router.get(['/','/login'],controller.islogedin,controller.getlogin,(req,res)=>{
    res.render('login')
})
router.post('/login',controller.postlogin,(req,res)=>{
    
    // res.render('register')
})
router.get('/register',controller.getregister,(req,res)=>{
    
    res.render('register')
})
router.post('/register',controller.postregister,(req,res)=>{
    
})
router.get('/edit',controller.getedit,(req,res)=>{
    res.render('edit')
})
router.get('/indexpage',controller.indexpage,(req,res)=>{
    res.render('indexpage')
})
router.get('/adduser',controller.getadduser,(req,res)=>{
    res.render('adduser')
})
router.post('/adduser',controller.postadduser,(req,res)=>{
    res.render('adduser')
})

module.exports=router;