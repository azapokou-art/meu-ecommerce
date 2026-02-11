class HandlePaymentWebhookUseCase {
    constructor(orderRepository, paymentGateway) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    async execute({ payload, signature }) {
        const result = await this.paymentGateway.handleWebhook(payload, signature);

        if (!result.success) {
            throw new Error('Webhook processing failed');
        }

        if (result.paymentStatus === 'paid') {
            const success = await this.orderRepository.updateStatus(result.orderId, 'paid');

            if (!success) {
                throw new Error('Failed to update order status');
            }
        }

        return { received: true };
    }
}

module.exports = HandlePaymentWebhookUseCase;