const express = require('express');
const paymentController = require('../handler/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);


router.post('/create-session', authMiddleware, express.json(), paymentController.createPaymentSession);
router.get('/success', paymentController.paymentSuccess);
router.get('/cancel', paymentController.paymentCancel);

module.exports = router;