class ConfirmPaymentUseCase {
    constructor(orderRepository, paymentGateway) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    async execute({ sessionId }) {
        if (!sessionId) {
            throw new Error('Session ID is required');
        }

        const session = await this.paymentGateway.retrieveCheckoutSession(sessionId);

        if (session.payment_status !== 'paid') {
            throw new Error('Payment not confirmed');
        }

        const orderId = session.metadata.order_id;

        if (!orderId) {
            throw new Error('Order ID not found in session metadata');
        }

        const success = await this.orderRepository.updateStatus(orderId, 'paid');

        if (!success) {
            throw new Error('Failed to update order status');
        }

        return {
            orderId,
            message: `Order #${orderId} marked as paid`
        };
    }
}

module.exports = ConfirmPaymentUseCase;
