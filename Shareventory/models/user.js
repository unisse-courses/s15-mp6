const mongoose = require('./connection');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, min: 6, required: true },
    date: { type: Date, default: Date.now }
  }
);

const User = mongoose.model('users', userSchema);

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
