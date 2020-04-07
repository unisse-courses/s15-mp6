const router = require('express').Router();
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const itemController = require('../controllers/itemController');
const { registerValidation, loginValidation, changePassValidation, addInventoryValidation, addItemValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');
const userModel = require('../models/user');
const inventoryModel = require('../models/inventory');
const itemModel = require('../models/item');

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

// My Inventory route
router.get('/myinventory', function(req, res) {
  userModel.getById(req.session.user, (err, user) => {
    const inventoryList = [];

    if (err) {
        // Database error occurred...
        req.flash('error_msg', 'Database error occurred.');
    } else {
        for(i=0; i<user.inventories.length; i++) {
            inventoryModel.getById(user.inventories[i], (err, inventory) => {
              if (err) {
                // Database error occurred...
                req.flash('error_msg', 'Database error occurred.');
              } else {
                if (inventory != null) {
                  inventoryList.push(inventory.toObject());
                }
              }
            })
        }
    }
    res.render('myinventory', {
      layout: 'main2',
      pageTitle: 'My Inventory',
      inventories: inventoryList
    })
  })
});

// Shared Inventory route
router.get('/sharedinventory', function(req, res) {
  res.render('sharedinventory', {
      layout: 'main2',
      pageTitle: 'Shared Inventory',
  })
});

// Item List route
router.get('/itemlist', function(req, res) {
  inventoryModel.getById(req.session.inventory, (err, inventory) => {
    const itemList = [];
    const name = inventory.name;
    const description = inventory.description;
    const total = inventory.total;

    if (err) {
        // Database error occurred...
        req.flash('error_msg', 'Database error occurred.');
    } else {
        for(i=0; i<inventory.items.length; i++) {
            itemModel.getById(inventory.items[i], (err, item) => {
              if (err) {
                // Database error occurred...
                req.flash('error_msg', 'Database error occurred.');
              } else {
                if (item != null) {
                  itemList.push(item.toObject());
                }
              }
            })
        }
    }
    res.render('itemlist', {
        layout: 'main2',
        pageTitle: 'Item List',
        items: itemList,
        name: name,
        description: description,
        total: total
    })
  })
});

// POST methods for form submissions
router.post('/register',isPublic, registerValidation, userController.registerUser);
router.post('/login', isPublic, loginValidation, userController.loginUser);
router.post('/settings', isPrivate, changePassValidation, userController.changePass);
router.post('/myinventory', isPrivate, addInventoryValidation, inventoryController.addInventory);
router.post('/itemlist', isPrivate, itemController.setInventory);
router.post('/addItem', isPrivate, addItemValidation, itemController.addItem);

// logout
router.get('/logout', isPrivate, userController.logoutUser);

module.exports = router;
