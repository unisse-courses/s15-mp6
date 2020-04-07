const mongoose = require('./connection');
const itemModel = require('../models/item');
const multer = require('multer');
const fs = require('fs');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'No Description' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
    total: { type: Number, default: 0},
    image: { data: Buffer, contentType: String }
  }
);

const Inventory = mongoose.model('Inventories', inventorySchema);

exports.create = function(obj, next) {
    const inventory = new Inventory(obj);
  
    inventory.save(function(err, inventory) {
      next(err, inventory);
    });
};

exports.getById = function(id, next) {
    Inventory.findById(id, function(err, inventory) {
        next(err, inventory);
    });
};

exports.getOne = function(query, next) {
    Inventory.findOne(query, function(err, inventory) {
        next(err, inventory);
    });
};

exports.addItem = function(id, item, next) {
    const quantity = item.quantity;
    Inventory.findOneAndUpdate({_id: id}, { $push: {items: item} }, function(err, inventory) {
        Inventory.findOneAndUpdate({_id: id}, { total: inventory.total + quantity }, function(err, inventory) {
            next(err, inventory);
        });
    });
};

exports.checkItem = function(id, name, next) {
    Inventory.find({$elemMatch: {_id: id, items: {name: name}}}, function(err, inventory) {
        next(err, inventory);
    });
};