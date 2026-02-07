const express = require('express');
const orderHandler = reuquire('../interface/handler/orderHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/', authMiddleware, orderHandler.createOrder);

router.get('/', authMiddleware, orderHandler.getUserOrders);

router.get('/:orderId', authMiddleware, orderHandler.getOrderById);

module.exports = router;