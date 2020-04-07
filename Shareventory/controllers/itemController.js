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

        inventoryModel.checkItem( req.session.inventory, { name: name }, (err, result) => {
            if (result) {
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
    } else {
        const messages = errors.array().map((item) => item.msg);
    
        req.flash('error_msg', messages.join(' '));
        res.redirect('/itemlist');
    }
};