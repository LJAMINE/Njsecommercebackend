const User = require('../models/user_model');

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({
        error: "User not found!"
      });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error."
    });
  }
};





// const User=require ('../models/user_model');

// exports.userById=(req,res,next,id)=>{

//    User.findById(id).exec((err,user)=>{

//     if(err || !user){
//         return res.status(404).json({
//          error:"User not found !!"
//         })
//      }
//      req.profile = user;
//      next();
//    })
  
// }