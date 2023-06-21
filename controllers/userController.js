
const User =require('../models/user_model')

exports.getOneUser=(req,res)=>{

    req.profile.hashed_password=undefined
    req.profile.salt=undefined
 
    res.json({
        user:req.profile
    })
};

exports.updateOneUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true }
  )

    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      user.hashed_password = undefined;
      user.salt = undefined;

      res.json({ user });
    })
    .catch((error) => {
      console.error('Error occurred:', error);
      res.status(400).json({ error: 'Failed to update user' });
    });

};
