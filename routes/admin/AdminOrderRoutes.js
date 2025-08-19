const { authMiddleware } = require("../../controller/web/user.controller");
const OrderSchema = require("../../models/OrderSchema");
const express = require('express');
const router = express.Router();

router.put('/orders/:orderId/status', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { orderId } = req.params;
    const { status, estimatedTime } = req.body;

    const order = await OrderSchema.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (estimatedTime) order.estimatedTime = estimatedTime;

    await order.save();

    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/orders/:orderId/status', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { orderId } = req.params;
    const { status, estimatedTime } = req.body;

    const order = await OrderSchema.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (estimatedTime) order.estimatedTime = estimatedTime;

    await order.save();

    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/admin/orders', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
