const mongoose = require('./connection');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: 'No Description.' },
    quantity: { type: Number, required: true, min: 0 },
    image: { data: Buffer, contentType: String }
  }
);

const Item = mongoose.model('Items', itemSchema);

exports.create = function(obj, next) {
    const item = new Item(obj);
  
    item.save(function(err, item) {
      next(err, item);
    });
};

exports.getById = function(id, next) {
    Item.findById(id, function(err, item) {
        next(err, item);
    });
};

exports.getOne = function(query, next) {
    Item.findOne(query, function(err, item) {
        next(err, item);
    });
};