const mongoose = require('./connection');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'No Description' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
    file: { type: String }
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
    Inventory.findOneAndUpdate({_id: id}, { $push: {items: item} }, function(err, inventory) {
        next(err, inventory);
    });
};

exports.checkItems = function(id, items, next) {
    Inventory.find({ _id: id, items: { $in: items }}, function(err, inventory) {
        next(err, inventory);
    });
  };

exports.deleteItem = function(id, itemId, next) {
    Inventory.findOneAndUpdate({_id: id}, { $pull: { items:  itemId } }, function(err, inventory) {
        next(err, inventory);
    });
};

exports.updateOne = function(id, updatedInventory, next) {
    Inventory.findOneAndUpdate({_id: id}, { name: updatedInventory.name, description: updatedInventory.description }, function(err, inventory) {
        next(err, inventory);
    });
};

exports.deleteOne = function(id, next) {
    Inventory.deleteOne({_id: id}, function(err,res) {
        next(err);
    });
};

exports.getMany = function(name, next) {
    Inventory.find({name: name}, function(err, inventories) {
        next(err, inventories);
    });
};
