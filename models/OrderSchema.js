const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      name: String,
      quantity: { type: Number, default: 1 },
      price: String,
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'cooking', 'ready-to-deliver', 'delivered'],
    default: 'pending',
  },
  estimatedTime: Number, // in minutes, set by admin
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
