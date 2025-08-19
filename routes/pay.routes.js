// routes/pay.routes.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/pay/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, currency = "usd", reservationId, customerEmail } = req.body;

    if (!amount || !reservationId) {
      return res.status(400).json({ error: "amount & reservationId required" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"], // Stripe will choose the best
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amount, // e.g. 5000 => $50.00
            product_data: {
              name: "Table Reservation",
              description: `Reservation ID: ${reservationId}`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail, // optional
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/reservation?canceled=1`,
      metadata: { reservationId },
    });

    // Option A: Frontend ko direct URL do
    return res.json({ url: session.url });

    // Option B: sessionId do (agar redirectToCheckout use karna ho)
    // return res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
