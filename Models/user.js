const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  plan: {
    cycle: { type: String, default: null },
    name: { type: String, default: null },
    price: { type: String, default: null },
    devices: [{ type: String }],
    state: { type: String, default: null },
    dateofsubscription: { type: Date, default: null },
  },
}, { collection: 'user' });

module.exports = mongoose.model('User', userSchema);

