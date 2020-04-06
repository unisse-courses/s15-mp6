const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { validationResult } = require('express-validator');

exports.registerUser = (req, res) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { name, email, password } = req.body;
  
    userModel.getOne({ email: email }, (err, result) => {
      if (result) {
        console.log(result);
        // found a match, return to login with error
        req.flash('error_msg', 'User already exists. Please login.');
        res.redirect('/login');
      } else {
        const saltRounds = 10;

        // Hash password
        bcrypt.hash(password, saltRounds, (err, hashed) => {
          const newUser = {
            name: name,
            email: email,
            password: hashed
          };

          userModel.create(newUser, (err, user) => {
            if (err) {
              req.flash('error_msg', 'Could not create user. Please try again.');
              res.redirect('/register');
              // res.status(500).send({ message: "Could not create user"});
            } else {
              req.flash('success_msg', 'You are now registered! Login below.');
              res.redirect('/login');
            }
          });
        });
      }
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
  
    req.flash('error_msg', messages.join(' '));
    res.redirect('/register');
  }
};

exports.loginUser = (req, res) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { email, password } = req.body;
  
    userModel.getOne({ email: email }, (err, user) => {
      if (err) {
        // Database error occurred...
        req.flash('error_msg', 'Something happened! Please try again.');
        res.redirect('/login');
      } else {
        // Successful query
        if (user) {
          // User found!
    
          bcrypt.compare(password, user.password, (err, result) => {
            // passwords match (result == true)
            if (result) {
              // Update session object once matched!
              req.session.user = user._id;
              req.session.name = user.name;
          
              console.log(req.session);
          
              res.redirect('/myinventory');
            } else {
              // passwords don't match
              req.flash('error_msg', 'Incorrect password. Please try again.');
              res.redirect('/login');
            }
          });
        } else {
          // No user found
          req.flash('error_msg', 'No registered user with that email. Please register.');
          res.redirect('/register');
        }
      }
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
  
    req.flash('error_msg', messages.join(' '));
    res.redirect('/login');
  }
};

exports.logoutUser = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
};

exports.changePass = (req, res) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { oldPass, password } = req.body;
  
    userModel.getById(req.session.user, (err, user) => {
      if (err) {
        // Database error occurred...
        req.flash('error_msg', 'Something happened! Please try again.');
        res.redirect('/settings');
      } else {
        // Successful query
        bcrypt.compare(oldPass, user.password, (err, result) => {
          // passwords match (result == true)
          if (result) {
            // Update user password once matched!
            const saltRounds = 10;

            // Hash password
            bcrypt.hash(password, saltRounds, (err, hashed) => {
              const newPass = hashed;
              
              //Update Password
              userModel.updatePass(req.session.user, newPass, (err, user) => {
                if (err) {
                  // Database error occurred...
                  req.flash('error_msg', '2Something happened! Please try again.');
                  res.redirect('/settings');
                } else {
                  req.flash('success_msg', 'Successfully changed password.');
                  res.redirect('/settings');
                }
              });
            });
          } else {
            // passwords don't match
            req.flash('error_msg', 'Incorrect password. Please try again.');
            res.redirect('/settings');
          }
        });
      }
    });
  } else {
    const messages = errors.array().map((item) => item.msg);
  
    req.flash('error_msg', messages.join(' '));
    res.redirect('/settings');
  }
};
