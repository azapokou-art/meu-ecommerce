const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();


router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboard);
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.get('/products', authMiddleware, adminMiddleware, adminController.getProducts);
router.patch('/products/:productId/status', authMiddleware, adminMiddleware, adminController.updateProductStatus);
router.get('/orders', authMiddleware, adminMiddleware, adminController.getOrders);
router.get('/orders/:orderId', authMiddleware, adminMiddleware, adminController.getOrderDetails);
router.patch('/orders/:orderId/status', authMiddleware, adminMiddleware, adminController.updateOrderStatus);

module.exports = router;