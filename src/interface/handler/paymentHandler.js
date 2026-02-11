const OrderRepositoryImpl = require('../../infrastructure/database/repositories/OrderRepositoryImpl');
const stripeService = require('../../infrastructure/services/stripeService');

const CreatePaymentSessionUseCase = require('../../application/use-cases/payment/CreatePaymentSessionUseCase');
const ConfirmPaymentUseCase = require('../../application/use-cases/payment/ConfirmPaymentUseCase');
const CancelPaymentUseCase = require('../../application/use-cases/payment/CancelPaymentUseCase');
const HandlePaymentWebhookUseCase = require('../../application/use-cases/payment/HandlePaymentWebhookUseCase');

const orderRepository = new OrderRepositoryImpl();

const createPaymentSessionUseCase = new CreatePaymentSessionUseCase(orderRepository, stripeService);
const confirmPaymentUseCase = new ConfirmPaymentUseCase(orderRepository, stripeService);
const cancelPaymentUseCase = new CancelPaymentUseCase(orderRepository);
const handlePaymentWebhookUseCase = new HandlePaymentWebhookUseCase(orderRepository, stripeService);

const paymentHandler = {
    async createPaymentSession(req, res) {
        try {
            const result = await createPaymentSessionUseCase.execute({
                userId: req.user.userId,
                orderId: req.body.orderId,
                customerEmail: req.user.email,
                successUrl: `http://localhost:3000/api/payments/success`,
                cancelUrl: `http://localhost:3000/api/payments/cancel?order_id=${req.body.orderId}`
            });

            res.json({
                message: 'Payment session created successfully',
                ...result
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async paymentSuccess(req, res) {
        try {
            let { session_id } = req.query;

            if (Array.isArray(session_id)) {
                session_id = session_id[0];
            }

            if (typeof session_id === 'string' && session_id.includes(',')) {
                session_id = session_id.split(',')[0];
            }

            const result = await confirmPaymentUseCase.execute({
                sessionId: session_id
            });

            res.json(result);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async paymentCancel(req, res) {
        try {
            const result = await cancelPaymentUseCase.execute({
                orderId: req.query.order_id
            });

            res.json(result);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async handleWebhook(req, res) {
        try {
            await handlePaymentWebhookUseCase.execute({
                payload: req.body,
                signature: req.headers['stripe-signature']
            });

            res.json({ received: true });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = paymentHandler;