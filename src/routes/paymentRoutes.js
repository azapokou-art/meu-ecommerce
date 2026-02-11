const express = require('express');
const paymentHandler = require('../interface/handler/paymentHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), paymentHandler.handleWebhook);
router.post('/create-session', authMiddleware, paymentHandler.createPaymentSession);
router.get('/success', paymentHandler.paymentSuccess);
router.get('/cancel', paymentHandler.paymentCancel);

module.exports = router;