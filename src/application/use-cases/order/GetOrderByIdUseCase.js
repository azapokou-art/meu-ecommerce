class GetOrderByIdUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(input) {
        const { orderId, userId } = input;

        if (!orderId) {
            throw new Error('Order id is required');
        }

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.user_id !== userId) {
            throw new Error('Access denied');
        }

        return order;
    }
}

module.exports = GetOrderByIdUseCase;
