const express=require('express');
const {salam,signup, signin,signout}=require('../controllers/userController');
const { userSignupValidator } = require('../middlewares/userValidator');
// const user = require('../models/user');
const router=express.Router();

router.get('/',salam);

router.post('/signup',userSignupValidator,signup)
router.post('/signin',signin)
router.get('/signout',signout)

module.exports=router;