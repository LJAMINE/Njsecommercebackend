const express=require('express');
const {salam,signup, signin,signout,authwithToken, authwithtoken2}=require('../controllers/userController');
const { userSignupValidator } = require('../middlewares/userValidator');
//const {auth} =require("../middlewares/auth");
// const user = require('../models/user');
const router=express.Router();
router.get('/',salam);
router.get("/authwithtoken",authwithToken);
router.post('/signup',userSignupValidator,signup)
router.post('/signin',signin)
router.get('/signout',signout)
//router.get("/authwithtoken2",authwithtoken2);


module.exports=router;