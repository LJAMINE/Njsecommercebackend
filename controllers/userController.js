 const User = require('../models/user_model');
 const jwt=require('jsonwebtoken');
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
    const { email, password } = req.body;
  
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
  
        res.cookie('token', token, { expire: new Date() + 10000000000 });
  
        const { _id, name, email, role } = user;
  
        return res.json({
          token,
          user: { _id, name, email, role },
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          error: 'Internal server error.',
        });
      });
  };
 
  
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




