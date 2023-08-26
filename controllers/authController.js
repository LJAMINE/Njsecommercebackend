 const { Router } = require('express');
const User = require('../models/user_model');
 const jwt=require('jsonwebtoken');
const auth = require('../middlewares/auth');
const nodemailer=require('nodemailer');
const session = require('express-session');

// Other middlewares and routes


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
  
        const token = jwt.sign({ _id: user._id ,role:user.role}, process.env.JWT_SECRET);
  
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

// sign out

exports.signout=(req,res)=>{

  res.clearCookie('token');

  res.json({
      message:"user signout"
  })

}

// send email 

exports.sendEmail = (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const code = generateRandomNumbers();

  User.findOne(
    { email },
    
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'aminelmgrmj1@gmail.com',
          pass: 'wwqmbexuvzgoqoju'
        }
      });

      const mailConfigs = {
        from: 'aminelmgrmj1@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: 'This is your reset code: ' + code
      };

      transporter.sendMail(mailConfigs, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Failed to send OTP' });
        }

        console.log(code);

        user.codeotp = code ;

        user.save();

        return res.status(200).json({ message: 'Email sent successfully', code });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
};


function generateRandomNumbers() {
  let result = '';

  for (let i = 0; i < 6; i++) {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    result += randomNumber.toString();
  }

  // Remove the trailing space
  result = result.trim();

  return result;
}



// Verify OTP
exports.verifyotp = async (req, res) => {
  

  try {
    const otp = req.body.otp;
  const email = req.body.email;
  console.log(req.body)
    // Find the user by their OTP code
     await User.findOne({ email:email }).then((user)=>{
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the provided OTP matches the codeotp stored in the user document
      if (otp === user.codeotp.toString()) {
        return res.status(200).json({ message: 'OTP verification successful' });
      } else {
        return res.status(400).json({ message: 'OTP verification failed' });
      }
     });

    
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};




exports.changePassword = (req, res) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Password and confirm password are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and confirm password do not match' });
  }

  // Proceed with password update logic
  // ...
  
  return res.status(200).json({ message: 'Password changed successfully' });
};




// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, password, confirmPassword, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (otp === user.codeotp.toString()) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Update the user's password
      const hashedPassword = user.cryptPassword(password);
      user.hashed_password = hashedPassword;

      user.codeotp = null;

      // Save
      await user.save();
      console.log('Password updated successfully')

      return res.status(200).json({ message: 'Password updated successfully' });
    } else {
      return res.status(400).json({ message: 'OTP verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// exports.resetPassword = (req, res, next) => {
//   const { email, password, confirmPassword ,otp} = req.body;

//   console.log("Received Request Body:", req.body);

//  console.log("body "+otp);
// ///check user.emai
//  const expectedOTP = req.session.otp;
//  console.log("session "+expectedOTP);

//    if (otp === expectedOTP) {
    
//     if (password !== confirmPassword) {
//       return res.status(400).json({ success: false, message: "Passwords do not match" });
//     }
  
//     User.findOne({ email }).then((currentUser) => {
//       if (currentUser) {
//         const hashedPassword = currentUser.cryptPassword(password);
//         // destroy 
//         currentUser.hashed_password = hashedPassword;
        
//         currentUser.save().then(() => {
//           req.session.destroy((err) => {
//       if (err) {
//         console.error('Error destroying session:', err);
//       }
      
//     })
//           res.status(200).json({ success: true, message: "Password updated" });
//         }).catch((error) => {
//           res.status(500).json({ success: false, message: "Error updating password" });
//         });
//       } else {
//         res.status(404).json({ success: false, message: "User not found" });
//       }
//     }).catch((error) => {
//       res.status(500).json({ success: false, message: "Error finding user" });
//     });
 
//   } else {
//    return res.sendStatus(400);
//   }

  
  
// };




















