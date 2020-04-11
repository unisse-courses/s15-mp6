const mongoose = require('./connection');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'No Description' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
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
    Inventory.findOneAndUpdate({_id: id}, { $push: {items: item} }, function(err, inventory) {
        next(err, inventory);
    });
};

exports.checkItem = function(id, name, next) {
    Inventory.find({$elemMatch: {_id: id, items: {name: name}}}, function(err, inventory) {
        next(err, inventory);
    });
};

exports.deleteItem = function(id, itemId, next) {
    Inventory.findOneAndUpdate({_id: id}, { $pull: { items: {_id: itemId} } }, function(err, inventory) {
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
