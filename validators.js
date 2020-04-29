const { body } = require('express-validator');

const registerValidation = [
  // Name should not be empty
  body('name').not().isEmpty().withMessage("Name is required."),

  // Email should not be empty and must be a valid email
  body('email').not().isEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),

  // Password needs to be min 6 chars
  body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

  // Confirm Password needs to be min 6 chars AND must match the req.body.password field
  body('confirmPass').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    })
];

const loginValidation = [
  // Email should not be empty and must be a valid email
  body('email').not().isEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),
  // Password should not be empty and needs to be min 6 chars
  body('password').not().isEmpty().withMessage("Password is required.")
];

const changePassValidation = [
  // Password needs to be min 6 chars
  body('oldPass').not().isEmpty().withMessage("Old Password is required."),

  // Password needs to be min 6 chars
  body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

  // Confirm Password needs to be min 6 chars AND must match the req.body.password field
  body('confirmPass').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    })
];

const inventoryValidation = [
  //Name should not be empty
  body('name').not().isEmpty().withMessage("Name is required."),
  //Name should have maximum 30 characters
  body('name').isLength({ max: 30 }).withMessage("Name should have maximum 30 characters only.")
];

const itemValidation = [
  //Name should not be empty
  body('name').not().isEmpty().withMessage("Name is required."),
  //Quantity should not be empty
  body('quantity').not().isEmpty().withMessage("Quantity is required.")
];

const shareValidation = [
  //Name should not be empty
  body('email').not().isEmpty().withMessage("Email is required."),
];
  
module.exports = { registerValidation, loginValidation, changePassValidation, inventoryValidation, itemValidation, shareValidation };

