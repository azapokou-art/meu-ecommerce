const express = require('express');
const cartController = require('../handler/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/add', authMiddleware, cartController.addItem);
router.get('/', authMiddleware, cartController.getCart);
router.put('/update', authMiddleware, cartController.updateQuantity);
router.delete('/remove', authMiddleware, cartController.removeItem);
router.post('/calculate-shipping', authMiddleware, cartController.calculateShipping);

module.exports = router;