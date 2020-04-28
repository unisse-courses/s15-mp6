const itemModel = require('../models/item');
const inventoryModel = require('../models/inventory');
const { validationResult } = require('express-validator');

exports.setInventory = (req,res) => {
    const { inventoryId } = req.body;

    req.session.inventory = inventoryId;

    console.log(req.session);
    res.redirect('/itemlist');
};

exports.addItem = (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const { name, description, quantity } = req.body;

        itemModel.getMany( name, (err, items) => {
            if (!items) {
                req.flash('success_msg', 'Item added.');
                res.redirect('/itemlist');
            } else {
                inventoryModel.checkItems( req.session.inventory, items, (err, inventory) => {
                    if (inventory.length != 0) {
                        // found a match, return to login with error
                        req.flash('error_msg', 'Item name already exists.');
                        res.redirect('/itemlist');
                    } else {
                        const newItem = {
                            name: name,
                            description: description,
                            quantity: quantity
                        };
                        itemModel.create(newItem, (err, item) => {
                            if (err) {
                                req.flash('error_msg', 'Could not add item. Please try again.');
                                res.redirect('/itemlist');
                            } else {
                                inventoryModel.addItem(req.session.inventory, item, (err, inventory) => {
                                    if (err) {
                                        req.flash('error_msg', 'Could not add item. Please try again.');
                                        res.redirect('/itemlist');
                                    } else {
                                        req.flash('success_msg', 'Item added.');
                                        res.redirect('/itemlist');
                                    }
                                })
                            }
                        });
                    }
                });
            }
        });
    } else {
        const messages = errors.array().map((item) => item.msg);
    
        req.flash('error_msg', messages.join(' '));
        res.redirect('/itemlist');
    }
};

exports.setItem = (req,res) => {
    const { itemId } = req.body;

    req.session.item = itemId;

    console.log(req.session);
    res.redirect('/edititem');
}

exports.updateItem = (req,res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const { name, description, quantity } = req.body;

        itemModel.getMany( name, (err, items) => {
            if (!items) {
                req.flash('success_msg', 'Item updated.');
                res.redirect('/itemlist');
            } else {
                inventoryModel.checkItems( req.session.inventory, items, (err, inventory) => {
                    if (inventory.length != 0) {
                        // found a match, return to login with error
                        req.flash('error_msg', 'Item name already exists.');
                        res.redirect('/itemlist');
                    } else {
                        const updatedItem = {
                            name: name,
                            description: description,
                            quantity: quantity
                        };
                        itemModel.updateOne(req.session.item, updatedItem, (err, item) => {
                            if (err) {
                                req.flash('error_msg', 'Could not update item. Please try again.');
                                res.redirect('/edititem');
                            } else {
                                req.flash('success_msg', 'Item updated.');
                                res.redirect('/itemlist'); 
                            }
                        });
                    }
                });
            }
        });
    } else {
        const messages = errors.array().map((item) => item.msg);
    
        req.flash('error_msg', messages.join(' '));
        res.redirect('/edititem');
    }
};

exports.deleteItem = (req,res) => {
    const { itemId } = req.body;

    inventoryModel.deleteItem(req.session.inventory, itemId, (err, inventory) => {
        if (err) {
            req.flash('error_msg', 'Could not delete item. Please try again.');
            res.redirect('/itemlist');
        } else {
            itemModel.deleteOne(itemId, (err) => {
                if (err) {
                    req.flash('error_msg', 'Could not delete item. Please try again.');
                    res.redirect('/itemlist');
                } else {
                    req.flash('success_msg', 'Item deleted.');
                    res.redirect('/itemlist');
                }
            });
        }
    });
};

exports.setSharedInventory = (req,res) => {
    const { inventoryId } = req.body;

    req.session.inventory = inventoryId;

    console.log(req.session);
    res.redirect('/shareditemlist');
};