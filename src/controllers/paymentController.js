const stripeService = require('../services/stripeService');
const Order = require('../models/Order');
const { pool } = require('../config/database');

const paymentController = {
    async createPaymentSession(req, res) {
    try {
        const userId = req.user.userId;
        const { orderId } = req.body;

        console.log('User logged in:', userId);
        console.log('Requested orderId:', orderId);
        console.log('User email:', req.user.email);

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }


            const order = await Order.findById(orderId);
            
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }


            if (order.user_id !== userId) {
                return res.status(403).json({ error: 'Access denied' });
            }


            if (order.status !== 'pending') {
                return res.status(400).json({ error: 'Order already processed' });
            }


            const session = await stripeService.createCheckoutSession({
                orderId: orderId,
                amount: parseFloat(order.total_amount),
                customerEmail: req.user.email,
                successUrl: `http://localhost:3000/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `http://localhost:3000/api/payments/cancel?order_id=${orderId}`
            });

            res.json({
                message: 'Payment session created successfully',
                sessionId: session.id,
                url: session.url,
                orderId: orderId
            });

        } catch (error) {
            console.error('Create payment session error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

        async paymentSuccess(req, res) {
        try {
            console.log('Full query parameters:', req.query);
            
            let { session_id } = req.query;
            console.log('Raw session_id type:', typeof session_id);
            console.log('Raw session_id value:', session_id);

        
            if (Array.isArray(session_id)) {
                session_id = session_id[0];
                console.log('Session_id was array, using first element:', session_id);
            }
            
        
            if (typeof session_id === 'string' && session_id.includes(',')) {
                session_id = session_id.split(',')[0];
                console.log('Cleaned duplicated session_id:', session_id);
            }

            if (!session_id) {
                return res.status(400).json({ error: 'Session ID is required' });
            }

            console.log('Final session_id to use:', session_id);

            const session = await stripeService.retrieveCheckoutSession(session_id);
            console.log('Stripe session status:', session.payment_status);

            if (session.payment_status === 'paid') {
                const orderId = session.metadata.order_id;
                console.log('Updating order:', orderId, 'to paid status');
                
                const success = await Order.updateStatus(orderId, 'paid');
                
                if (success) {
                    res.json({
                        message: 'Payment confirmed successfully. Order #' + orderId + ' is now paid.',
                        orderId: orderId
                    });
                } else {
                    res.status(500).json({
                        error: 'Failed to update order status'
                    });
                }
            } else {
                res.status(400).json({
                    error: 'Payment not confirmed'
                });
            }

        } catch (error) {
            console.error('Payment success error:', error);
            res.status(500).json({ error: 'Internal server error: ' + error.message });
        }
    },

    async paymentCancel(req, res) {
        try {
            const { order_id } = req.query;

            if (order_id) {

                await Order.updateStatus(order_id, 'cancelled');
            }

            res.json({
                message: 'Payment cancelled',
                orderId: order_id
            });

        } catch (error) {
            console.error('Payment cancel error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async handleWebhook(req, res) {
        try {
            const signature = req.headers['stripe-signature'];
            const payload = req.body;

            const result = await stripeService.handleWebhook(payload, signature);

            if (result.success && result.paymentStatus === 'paid') {

                await Order.updateStatus(result.orderId, 'paid');
            }

            res.json({ received: true });

        } catch (error) {
            console.error('Webhook error:', error);
            res.status(400).json({ error: 'Webhook error' });
        }
    }
};

module.exports = paymentController;