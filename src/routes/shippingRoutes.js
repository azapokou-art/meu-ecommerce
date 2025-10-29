const express = require('express');
const shippingController = require('../controllers/shippingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/methods', shippingController.getShippingMethods);
router.post('/calculate', shippingController.calculateShipping);


router.post('/cart/calculate', authMiddleware, shippingController.calculateCartShipping);

module.exports = router;