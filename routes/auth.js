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

// Settings route
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
        res.render('myinventory', {
          layout: 'main2',
          pageTitle: 'My Inventory',
          inventories: inventoryList
        })
    }
  })
});

//Edit Inventory route
router.get('/editinventory', function(req, res) {
  inventoryModel.getById(req.session.inventory, (err, inventory) => {
    if (err) {
      // Database error occurred...
      req.flash('error_msg', 'Database error occurred.');
    } else {
      res.render('editinventory', {
        layout: 'main2',
        pageTitle: 'My Inventory',
        inventory: inventory.toObject()
      })
    }
  })
});

// Shared Inventory route
router.get('/sharedinventory', function(req, res) {
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
        res.render('sharedinventory', {
          layout: 'main2',
          pageTitle: 'Shared Inventory',
          inventories: inventoryList
        })
    }
  })
});

// Item List route
router.get('/itemlist', function(req, res) {
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
          res.render('itemlist', {
            layout: 'main2',
            pageTitle: 'Item List',
            items: itemList,
            name: name,
            description: description
        });
      }
  });
});

//Edit Item route
router.get('/edititem', function(req, res) {
  itemModel.getById(req.session.item, (err, item) => {
    if (err) {
      // Database error occurred...
      req.flash('error_msg', 'Database error occurred.');
    } else {
      res.render('edititem', {
        layout: 'main2',
        pageTitle: 'My Inventory',
        item: item.toObject()
      });
    }
  });
});

//Shared Item List route
router.get('/itemlist', function(req, res) {
  inventoryModel.getById(req.session.inventory, (err, inventory) => {
    inventoryModel.getTotal(req.session.inventory, (err, total) => {
      const itemList = [];
      const name = inventory.name;
      const description = inventory.description;
      const totalQuantity = total;

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
          res.render('itemlist', {
            layout: 'main2',
            pageTitle: 'Item List',
            items: itemList,
            name: name,
            description: description,
            total: totalQuantity
        });
      }
    });
  });
});

//Share route
router.get('/share', function(req,res) {
  inventoryModel.getById(req.session.inventory, (err,inventory) => {
    const name = inventory.name;

    res.render('share', {
      layout: 'main2',
      pageTitle: 'My Inventory',
      name: name,
      inventoryId: req.session.inventory
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
router.post('/shareInventory', isPrivate, shareValidation, inventoryController.shareInventory)

// logout
router.get('/logout', isPrivate, userController.logoutUser);

module.exports = router;
