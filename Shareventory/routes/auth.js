const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation, changePassValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');

// GET login to display login page
router.get('/login', isPublic, (req, res) => {
  res.render('login', {
    pageTitle: 'Login',
  });
});

// GET register to display registration page
router.get('/register', isPublic, (req, res) => {
  res.render('register', {
    pageTitle: 'Registration',
  });
});

// GET settings to display settings page
router.get('/settings', isPrivate, (req, res) => {
  res.render('settings', {
    layout: 'main2',
    pageTitle: 'Settings',
  });
});

// POST methods for form submissions
router.post('/register',isPublic, registerValidation, userController.registerUser);
router.post('/login', isPublic, loginValidation, userController.loginUser);
router.post('/settings', isPrivate, changePassValidation, userController.changePass);

// logout
router.get('/logout', isPrivate, userController.logoutUser);

module.exports = router;
