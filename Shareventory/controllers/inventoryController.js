const inventoryModel = require('../models/inventory');
const userModel = require('../models/user');
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