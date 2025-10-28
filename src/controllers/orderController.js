const Order = require('../models/Order');
const Cart = require('../models/Cart');

const orderController = {
    async createOrder(req, res) {
        try {
            const userId = req.user.userId;
            const { paymentMethod, shippingAddress } = req.body;

            const cartItems = await Cart.findByUserId(userId);
            
            if (cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

          
            const orderId = await Order.create({
                userId,
                totalAmount,
                paymentMethod: paymentMethod || 'credit_card',
                shippingAddress: shippingAddress || 'Address not provided'
            });

        
            for (const item of cartItems) {
                await Order.addItem(orderId, {
                    productId: item.product_id,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    subtotal: item.subtotal
                });
            }

        
            await Cart.clear(userId);

            res.status(201).json({
                message: 'Order created successfully',
                orderId: orderId,
                totalAmount: totalAmount.toFixed(2)
            });

        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserOrders(req, res) {
        try {
            const userId = req.user.userId;
            const orders = await Order.findByUserId(userId);

            res.json({
                message: 'Orders retrieved successfully',
                orders: orders,
                count: orders.length
            });

        } catch (error) {
            console.error('Get orders error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getOrderById(req, res) {
        try {
            const { orderId } = req.params;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

        
            if (order.user_id !== req.user.userId) {
                return res.status(403).json({ error: 'Access denied' });
            }

            res.json({
                message: 'Order retrieved successfully',
                order: order
            });

        } catch (error) {
            console.error('Get order error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = orderController;