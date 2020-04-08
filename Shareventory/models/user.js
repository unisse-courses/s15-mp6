const mongoose = require('./connection');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, min: 6, required: true },
    date: { type: Date, default: Date.now },
    inventories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventories' }],
    shared: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventories' }]
  }
);

const User = mongoose.model('Users', userSchema);

exports.create = function(obj, next) {
  const user = new User(obj);

  user.save(function(err, user) {
    next(err, user);
  });
};

exports.getById = function(id, next) {
  User.findById(id, function(err, user) {
    next(err, user);
  });
};

exports.getOne = function(query, next) {
  User.findOne(query, function(err, user) {
    next(err, user);
  });
};

exports.updatePass = function(id, newPass, next) {
  User.findOneAndUpdate({_id: id}, { $set: {password: newPass} }, function(err, user) {
    next(err, user);
  });
};

exports.addInventory = function(id, inventory, next) {
  User.findOneAndUpdate({_id: id}, { $push: {inventories: inventory} }, function(err, user) {
    next(err, user);
  });
};

exports.checkInventory = function(id, name, next) {
  User.find({$elemMatch: {_id: id, inventories: {name: name}}}, function(err, user) {
      next(err, user);
  });
};

exports.deleteInventory = function(id, inventoryId, next) {
  User.findOneAndUpdate({_id: id}, { $pull: { inventories: {_id: inventoryId} } }, function(err, user) {
    next(err, user);
  });
};

exports.addSharedInventory = function(id, inventory, next) {
  User.findOneAndUpdate({_id: id}, { $push: {shared: inventory} }, function(err, user) {
    next(err, user);
  });
};

exports.deleteSharedInventory = function(inventoryId, next) {
  User.updateMany({shared: {_id: inventoryId}}, { $pull: { shared: {_id: inventoryId} } }, function(err, user) {
    next(err, user);
  });
};