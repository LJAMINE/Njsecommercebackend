const express=require('express');
const {salam,signup, signin,signout,authwithToken, authwithtoken2,sendEmail,verifyotp,changePassword,resetPassword}=require('../controllers/authController');
const { userSignupValidator } = require('../middlewares/userValidator');
//const {auth} =require("../middlewares/auth");
const{requireSignIn}=require('../middlewares/auth');
// const user = require('../models/user');
const router=express.Router();
router.get('/',salam);
router.get("/authwithtoken",authwithToken);
router.post('/signup',userSignupValidator,signup)
router.post('/signin',signin)
router.get('/signout',signout)
router.post('/sendemail',sendEmail)
// router.post('/verifyotp',verifyotp)
router.post('/changePassword',changePassword)
router.post('/verifyotp',verifyotp)
router.post('/resetPassword',resetPassword)
router.get('/hello',requireSignIn,(req,res)=>{
    res.send('hello there')
})

module.exports=router;