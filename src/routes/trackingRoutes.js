const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/order/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.userId;

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.user_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const trackingInfo = await Order.getOrderTracking(orderId);

        res.json({
            success: true,
            order: trackingInfo
        });

    } catch (error) {
        console.error('Get order tracking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status } = req.query;

        const orders = await Order.findByUserWithStatus(userId, status);

        res.json({
            success: true,
            orders: orders,
            count: orders.length,
            filters: { status }
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/:orderId/status', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, tracking_code, estimated_delivery } = req.body;

        
        const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid order status' });
        }

        const updated = await Order.updateStatus(orderId, status, tracking_code, estimated_delivery);

        if (!updated) {
            return res.status(404).json({ error: 'Order not found' });
        }

        
        const updatedOrder = await Order.findById(orderId);

        res.json({
            success: true,
            message: `Order status updated to ${status} successfully`,
            order: updatedOrder
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.query;

        const orders = await Order.findByStatus(status || 'pending');

        res.json({
            success: true,
            orders: orders,
            count: orders.length,
            status: status || 'all'
        });

    } catch (error) {
        console.error('Get orders by status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;