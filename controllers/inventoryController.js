const inventoryModel = require('../models/inventory');
const userModel = require('../models/user');
const itemModel = require('../models/item');
const { validationResult } = require('express-validator');

exports.addInventory = (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const { name, description } = req.body;
    
        userModel.checkInventory( req.session.user, { name: name }, (err, result) => {
            if (result) {
                // found a match, return to login with error
                req.flash('error_msg', 'Inventory name already exists.');
                res.redirect('/myinventory');
            } else {
                const newInventory = {
                    name: name,
                    description: description,
                };
                inventoryModel.create(newInventory, (err, inventory) => {
                    if (err) {
                        req.flash('error_msg', 'Could not create inventory. Please try again.');
                        res.redirect('/myinventory');
                    } else {
                        userModel.addInventory(req.session.user, inventory, (err, user) => {
                            if (err) {
                                req.flash('error_msg', 'Could not create inventory. Please try again.');
                                res.redirect('/myinventory');
                            } else {
                                req.flash('success_msg', 'New inventory created.');
                                res.redirect('/myinventory');
                            }
                        })
                    }
                });
            }
        });
    } else {
        const messages = errors.array().map((item) => item.msg);
    
        req.flash('error_msg', messages.join(' '));
        res.redirect('/myinventory');
    }
};

exports.setInventory = (req,res) => {
    const { inventoryId } = req.body;

    req.session.inventory = inventoryId;

    console.log(req.session);
    res.redirect('/editinventory');
};

exports.updateInventory = (req,res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const { name, description } = req.body;

        userModel.checkInventory( req.session.user, { name: name }, (err, result) => {
            if (result) {
                // found a match, return to login with error
                req.flash('error_msg', 'Inventory name already exists.');
                res.redirect('/editinventory');
            } else {
                const updatedInventory = {
                    name: name,
                    description: description
                };
                inventoryModel.updateOne(req.session.inventory, updatedInventory, (err, inventory) => {
                    if (err) {
                        req.flash('error_msg', 'Could not update inventory. Please try again.');
                        res.redirect('/editinventory');
                    } else {
                        req.flash('success_msg', 'Inventory updated.');
                        res.redirect('/myinventory'); 
                    }
                });
            }
        });
    } else {
        const messages = errors.array().map((item) => item.msg);
    
        req.flash('error_msg', messages.join(' '));
        res.redirect('/editinventory');
    }
};

exports.deleteInventory = (req,res) => {
    const { inventoryId } = req.body;

    userModel.deleteSharedInventory(inventoryId, (err, user) => {
        if (err) {
            req.flash('error_msg', 'Could not delete inventory. Please try again.');
            res.redirect('/myinventory');
        } else {
            userModel.deleteInventory(req.session.user, inventoryId, (err, user) => {
                if (err) {
                    req.flash('error_msg', 'Could not delete inventory. Please try again.');
                    res.redirect('/myinventory');
                } else {
                    inventoryModel.getById(inventoryId, (err, inventory) => {
                        itemModel.deleteItems(inventory, (err) => {
                            if (err) {
                                req.flash('error_msg', 'Could not delete inventory. Please try again.');
                                res.redirect('/myinventory');
                            } else {
                                inventoryModel.deleteOne(inventoryId, (err) => {
                                    if (err) {
                                        req.flash('error_msg', 'Could not delete inventory. Please try again.');
                                        res.redirect('/myinventory');
                                    } else {
                                        req.flash('success_msg', 'Inventory deleted.');
                                        res.redirect('/myinventory');
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
};

exports.setSharedInventory = (req,res) => {
    const { inventoryId } = req.body;

    req.session.inventory = inventoryId;

    console.log(req.session);
    res.redirect('/share');
};

exports.shareInventory = (req,res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const { email, inventoryId } = req.body;

        userModel.getOne( { email: email }, (err, user) => {
            if (err) {
                // Database error occurred...
                req.flash('error_msg', 'Something happened! Please try again.');
                res.redirect('/share');
              } else {
                // Successful query
                if (user) {
                    // User found!
                    inventoryModel.getById(inventoryId, (err, inventory) => {
                        if (err) {
                            req.flash('error_msg', 'Could not create inventory. Please try again.');
                            res.redirect('/share');
                        } else {
                            userModel.addSharedInventory(user, inventory, (err, user) => {
                                if (err) {
                                    req.flash('error_msg', 'Could not share inventory. Please try again.');
                                    res.redirect('/share');
                                } else {
                                    req.flash('success_msg', 'Inventory shared.');
                                    res.redirect('/share');
                                }
                            })
                        }
                    });
                } else {
                  // No user found
                  req.flash('error_msg', 'No registered user with that email.');
                  res.redirect('/share');
                }
              }
        });
    } else {
        const messages = errors.array().map((item) => item.msg);
    
        req.flash('error_msg', messages.join(' '));
        res.redirect('/share');
    }
};