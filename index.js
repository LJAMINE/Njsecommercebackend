const express=require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const cookieparser=require('cookie-parser');

//imports routes
const userRoutes=require('./routes/users_routes');

//conig app
const app=express();
require('dotenv').config();
  


//routes middelware

const url = "mongodb://127.0.0.1:27017/ecommerce";

mongoose.connect(url)
.then(()=>console.log("data base connected"))
.catch(err=>console.error("db could not conncted.."))

//middlewares
app.use(express.json())
// Validation middleware
app.use(
  
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail(),
  body('phoneNumber').isMobilePhone(),
  body('password').notEmpty().isLength({ min: 6, max: 10 }).withMessage('Password must be between 6 to 10 characters')
);

app.use(cookieparser())





// routes middleware
app.use('/api/users',userRoutes);


const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`app is running on port ${port}`));