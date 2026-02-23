class CancelPaymentUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute({ orderId }) {
        if (!orderId) {
            throw new Error('Order ID is required');
        }

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status === 'paid') {
            throw new Error('Cannot cancel a paid order');
        }

        const success = await this.orderRepository.updateStatus(orderId, 'cancelled');

        if (!success) {
            throw new Error('Failed to cancel order');
        }

        return {
            orderId,
            message: `Order #${orderId} cancelled`
        };
    }
}

module.exports = CancelPaymentUseCase;