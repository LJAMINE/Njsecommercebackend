const express=require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const cookieparser=require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser'); 



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

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())


// Validation middleware
app.use(
  
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail(),
  body('phoneNumber').isMobilePhone(),
  body('password').notEmpty().isLength({ min: 6, max: 10 }).withMessage('Password must be between 6 to 10 characters')
);
app.use(cookieparser())
app.use(session({
  secret: 'your-secret-key', // A random secret key to sign the session ID cookie
  resave: false,
  saveUninitialized: false,
}));





// routes middleware
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/product',productRoutes);
app.use('/api/uploads', express.static('uploads'));




app.get('/',(req,res)=>{
  sendEmail()
  .then(response=>res.send(response.message))
  .catch(error=>res.status(500).send(error.message))
})


const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`app is running on port ${port}`));