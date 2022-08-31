const { optionsDB } = require('../options/mongoDB');
const mongoose = require('mongoose');

const CarritoSchema = mongoose.Schema({
  id: { type: Number, require: true },
  timestamp: { type: String, require: true, minLength: 1, maxLength: 50 },
  productos: { type: String, require: true }
});
module.exports = CarritoDB = mongoose.model('carritos', CarritoSchema)