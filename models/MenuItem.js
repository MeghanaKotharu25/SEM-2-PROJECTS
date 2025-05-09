const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Protein-rich', 'Carb-rich', 'Veg', 'Non-Veg', 'Others'],
    default: 'Others',
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
