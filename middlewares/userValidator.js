
const { body, validationResult } = require('express-validator');

exports.userSignupValidator = [
  // Use the body() function instead of req.check()
  
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail(),
  body('phoneNumber').isMobilePhone(),
  body('password','password is required !')
    .notEmpty()
    .isLength({ min: 6, max: 10 })
    .withMessage('Password must be between 6 to 10 characters'),


  (req, res, next) => {
    // Extract validation errors
   
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return  res.status(400).json(errors);
    }

    next();
  }
];



