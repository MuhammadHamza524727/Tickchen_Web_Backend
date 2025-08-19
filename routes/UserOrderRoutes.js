const express = require('express');
const router = express.Router();
const OrderSchema = require('../models/OrderSchema');
const { authMiddleware } = require('../controller/web/user.controller');


router.get('/all-orders', async (req, res) => {
  try {
    const orders = await OrderSchema
      .find()
      .populate("user", "-password -__v") // full user details except password & __v
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// routes/orderRoutes.js
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "cooking", "ready-to-deliver", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await OrderSchema.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "username email");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Status updated successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



//       http://localhost:8080/api/user-order/orders
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body; // items = [{ name, quantity, price }]
    console.log(items)

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const order = new OrderSchema({
      user: req.user._id,
      items,
      status: 'pending',
    });
    console.log(order,"....")

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// //      http://localhost:8080/api/user/user-order
// router.get('/user-order', authMiddleware, async (req, res) => {
//   try {
//     const orders = await OrderSchema.find({ user: req.user._id }).populate("user", "username profileImageUrl") .sort({ createdAt: -1 });
//     res.json({ orders });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
//      http://localhost:8080/api/user/user-order
router.get('/user-order', authMiddleware, async (req, res) => {
  try {
    const orders = await OrderSchema.find({ user: req.user._id })
      .populate("user", "username profileImageUrl") // naam + profile image
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(200).json({ orders: [], message: "No orders found" });
    }

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;