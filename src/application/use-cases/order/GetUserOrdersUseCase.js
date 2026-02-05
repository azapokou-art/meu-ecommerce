class GetUserOrdersUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(input) {
        const { userId } = input;

        if (!userId) {
            throw new Error('User ID is required');
        }

        const orders = await this.orderRepository.findByUserId(userId);
        return orders;
    }
}

module.exports = GetUserOrdersUseCase;