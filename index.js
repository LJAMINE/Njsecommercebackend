const express=require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const cookieparser=require('cookie-parser');
var cors = require('cors')
const nodemailer=require('nodemailer');


//imports routes
const authRoutes=require('./routes/auth_routes');
const userRoutes=require('./routes/users_routes');
const categoryRoutes=require('./routes/categories');
const productRoutes=require('./routes/product');

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
app.use(cors())
app.use(cookieparser())





// routes middleware
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/product',productRoutes);



function sendEmail(){

  return new Promise((resolve,reject)=>{

    const transporter =nodemailer.createTransport({

      service:'gmail',
      auth:{
        user:'aminelmgrmj1@gmail.com',
        pass:'wwqmbexuvzgoqoju'
      }
    })
    
   const mail_configs={
    from:'aminelmgrmj1@gmail.com',
    to:'aminelmgrmj@gmail.com',
    subject:'testing email ppppp',
    text:'checking if email sent'
   }

transporter.sendMail(mail_configs,function(error,info){
  if (error){
    console.log(error)
    return reject({message:'an error has occured'})
  }
  return resolve ({message:"email sent succesfuly"})
})

  })
}

app.get('/',(req,res)=>{
  sendEmail()
  .then(response=>res.send(response.message))
  .catch(error=>res.status(500).send(error.message))
})


const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`app is running on port ${port}`));