const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  stripeCustomerId: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  // Add any other user details you need
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


