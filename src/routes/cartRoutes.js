const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, cartController.addItem);
router.get('/', authMiddleware, cartController.getCart);
router.put('/update', authMiddleware, cartController.updateQuantity);
router.delete('/remove', authMiddleware, cartController.removeItem);

module.exports = router;