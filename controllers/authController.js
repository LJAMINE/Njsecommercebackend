 const { Router } = require('express');
const User = require('../models/user_model');
 const jwt=require('jsonwebtoken');
const auth = require('../middlewares/auth');
 exports.salam=(req,res)=>{
    res.send({message:'users module'})
}

//  sign up

exports.signup = (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(user => {
            res.send({"success":"true","data":user});
        })
        .catch(err => {
            res.status(400).send(err);
        });
};

//sign in 

exports.signin = (req, res) => {
    const { email,  password } = req.body;
  
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            error: 'User not found. Please sign up.',
          });
        }
  
        if (!user.authenticate(password)) {
          return res.status(401).json({
            error: 'Email and password do not match.',
          });
        }
  
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  
        res.cookie('token', token, { expire: new Date() + 200000000000 });
  
        const { _id, name, email, phoneNumber ,role } = user;
  
        return res.json({
          token,
          user: { _id, name, email,phoneNumber ,role },
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          error: 'Internal server error.',
        });
      });
  };

  //  abderahime 

  exports.authwithToken = async (req ,res) => { 
    try {

      const token =req.header("token");
      if(!token)return res.json(false);
      const verified =jwt.verify(token,process.env.JWT_SECRET);
      if(!verified) return res.json(false);
 
      const user =await User.findById(verified._id);
      
      if(!user)return res.json(false);
      const { _id, name, email, phoneNumber ,role } = user;
  
        return res.json({
          token,
          user: { _id, name, email,phoneNumber ,role },
        });  
    } catch (error) {
      res.status(500).json({error:e.message});
    }
  } ;

  exports.authwithtoken2 =async (req,res,next)=>{
      
    try {
        const token =req.header("token");
        
        if(!token) 
        return res.status(401).json({msg:"no auth token ,denied access"});

        const verified =jwt.verify(token,process.env.JWT_SECRET);
        if(!verified){
          return res.status(401).json({msg:"tokenverification failed, authorization denied"});
        }
       return res.json(verified);
        
    } catch (error) {
        res.status(500).json({error:err.message});
        
    }
};

// exports.updateprofile=async(req,res,next)=>{
//   await commentModel.findByandUpdate(req.params._id,req.body).then((response)=>{
//     res.status(200).json({success:true,Comment:response});
//   });
// }


   
  

  
 
// // get user data 
// router.get("/", auth , async (req,res)=>{

//   const user =await User.findById(req.user);
//   res.json({ user: { _id, name, email,phoneNumber ,role },token:req.token});

// });



  
// sign out

  exports.signout=(req,res)=>{

    res.clearCookie('token');

    res.json({
        message:"user signout"
    })

  }

// exports.signin=(req,res)=>{

//     const {email,password}=req.body;

//     User.findOne({email},(err,user)=>{

//         if(err||!user){
//             return res.status(400).json({
//                 error:'User not found this email , please sign up'
//             })
//         }

//         if(user.authenticate()){
//             return res.status(401).json({
//                 error:'email and password dont match !!!'
//             })
//         }

//         const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
        
//         res.cookie('token',token,{expire:new Date()+9000000})
       
//         const{ _id,name,email,role}=user;

//        return  res.json({
//             token , user :{_id,name,email,role}
//         })
//     })
// }




