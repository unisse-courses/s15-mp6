const router = require('express').Router();
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const itemController = require('../controllers/itemController');
const { registerValidation, loginValidation, changePassValidation, inventoryValidation, itemValidation, shareValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');
const userModel = require('../models/user');
const inventoryModel = require('../models/inventory');
const itemModel = require('../models/item');

// Login page route
router.get('/login', isPublic, (req, res) => {
  res.render('login', {
    pageTitle: 'Login',
  });
});

// Register page route
router.get('/register', isPublic, (req, res) => {
  res.render('register', {
    pageTitle: 'Registration',
  });
});

// About page route
router.get('/about', isPrivate, (req, res) => {
  res.render('about', {
    layout: 'main2',
    pageTitle: 'About Page',
    user: req.session.name
  });
});

// Settings route
router.get('/settings', isPrivate, (req, res) => {
  res.render('settings', {
    layout: 'main2',
    pageTitle: 'Settings',
    user: req.session.name
  });
});

// My Inventory route
router.get('/myinventory', isPrivate, function(req, res) {
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
        setTimeout(function afterOneSecond() {
          res.render('myinventory', {
            layout: 'main2',
            pageTitle: 'My Inventory',
            inventories: inventoryList,
            user: req.session.name
          })
        }, 1000)
    }
  })
});

//Edit Inventory route
router.get('/editinventory', isPrivate, function(req, res) {
  inventoryModel.getById(req.session.inventory, (err, inventory) => {
    if (err) {
      // Database error occurred...
      req.flash('error_msg', 'Database error occurred.');
    } else {
      res.render('editinventory', {
        layout: 'main2',
        pageTitle: 'My Inventory',
        inventory: inventory.toObject(),
        user: req.session.name
      })
    }
  })
});

// Shared Inventory route
router.get('/sharedinventory', isPrivate, function(req, res) {
  userModel.getById(req.session.user, (err, user) => {
    const inventoryList = [];

    if (err) {
        // Database error occurred...
        req.flash('error_msg', 'Database error occurred.');
    } else {
        for(i=0; i<user.shared.length; i++) {
            inventoryModel.getById(user.shared[i], (err, inventory) => {
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
        setTimeout(function afterOneSecond() {
          res.render('sharedinventory', {
            layout: 'main2',
            pageTitle: 'Shared Inventory',
            inventories: inventoryList,
            user: req.session.name
          })
        }, 1000)
    }
  })
});

// Item List route
router.get('/itemlist', isPrivate, function(req, res) {
  inventoryModel.getById(req.session.inventory, (err, inventory) => {
      const itemList = [];
      const name = inventory.name;
      const description = inventory.description;

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
              });
          }
          setTimeout(function afterOneSecond() {
            res.render('itemlist', {
              layout: 'main2',
              pageTitle: 'Item List',
              items: itemList,
              name: name,
              description: description,
              user: req.session.name
            })
          }, 1000)
      }
  });
});

//Edit Item route
router.get('/edititem', isPrivate, function(req, res) {
  itemModel.getById(req.session.item, (err, item) => {
    if (err) {
      // Database error occurred...
      req.flash('error_msg', 'Database error occurred.');
    } else {
      res.render('edititem', {
        layout: 'main2',
        pageTitle: 'My Inventory',
        item: item.toObject(),
        user: req.session.name
      });
    }
  });
});

//Shared Item List route
router.get('/shareditemlist', isPrivate, function(req, res) {
  inventoryModel.getById(req.session.inventory, (err, inventory) => {
      const itemList = [];
      const name = inventory.name;
      const description = inventory.description;

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
              });
          }
          setTimeout(function afterOneSecond() {
            res.render('shareditemlist', {
              layout: 'main2',
              pageTitle: 'Item List',
              items: itemList,
              name: name,
              description: description,
              user: req.session.name
            });
          }, 1000)
      }
  });
});

//Share route
router.get('/share', isPrivate, function(req,res) {
  inventoryModel.getById(req.session.inventory, (err,inventory) => {
    const name = inventory.name;
    const sharedEmails = inventory.sharedEmails;

    res.render('share', {
      layout: 'main2',
      pageTitle: 'My Inventory',
      name: name,
      sharedEmails: sharedEmails,
      inventoryId: req.session.inventory,
      user: req.session.name
    });
  });
});

// POST methods for form submissions
router.post('/register',isPublic, registerValidation, userController.registerUser);
router.post('/login', isPublic, loginValidation, userController.loginUser);
router.post('/settings', isPrivate, changePassValidation, userController.changePass);
router.post('/myinventory', isPrivate, inventoryValidation, inventoryController.addInventory);
router.post('/itemlist', isPrivate, itemController.setInventory);
router.post('/addItem', isPrivate, itemValidation, itemController.addItem);
router.post('/editinventory', isPrivate, inventoryController.setInventory);
router.post('/updateInventory', isPrivate, inventoryValidation, inventoryController.updateInventory);
router.post('/deleteinventory', isPrivate, inventoryController.deleteInventory);
router.post('/edititem', isPrivate, itemController.setItem);
router.post('/updateItem', isPrivate, itemValidation, itemController.updateItem);
router.post('/deleteitem', isPrivate, itemController.deleteItem);
router.post('/sharedinventory', isPrivate);
router.post('/shareditemlist', isPrivate, itemController.setSharedInventory);
router.post('/share', isPrivate, inventoryController.setSharedInventory);
router.post('/shareInventory', isPrivate, shareValidation, inventoryController.shareInventory);
router.post('/removeEmail', isPrivate, inventoryController.removeEmail);

// logout
router.get('/logout', isPrivate, userController.logoutUser);

module.exports = router;
