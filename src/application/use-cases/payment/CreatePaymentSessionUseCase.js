class CreatePaymentSessionUseCase {
    constructor(orderRepository, paymentGateway) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    async execute({ userId, orderId, customerEmail, successUrl, cancelUrl }) {
        if (!orderId) {
            throw new Error('Order ID is required');
        }

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.user_id !== userId) {
            throw new Error('Access denied');
        }

        if (order.status !== 'pending') {
            throw new Error('Order already processed');
        }

        const session = await this.paymentGateway.createCheckoutSession({
            orderId,
            amount: parseFloat(order.total_amount),
            customerEmail,
            successUrl,
            cancelUrl
        });

        return {
            sessionId: session.id,
            url: session.url,
            orderId
        };
    }
}

module.exports = CreatePaymentSessionUseCase;
