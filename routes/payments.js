const router = require('express').Router();
const Payment = require('../models/Payment');
const { authenticateToken } = require('../middleware/auth');

// POST /api/payment — auth required, process payment (demo)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { productId, productName, amount, currency } = req.body;

    const payment = await Payment.create({
      user: req.user.id,
      productId,
      productName,
      amount,
      currency: currency || 'KGS',
      status: 'completed'
    });

    res.json({
      message: 'Payment processed successfully!',
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency
      },
      notification: 'Confirmation sent via WhatsApp/Telegram'
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/payments — auth required, get user's payments
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
