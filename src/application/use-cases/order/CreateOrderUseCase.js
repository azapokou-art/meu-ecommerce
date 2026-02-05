class CreateOrderUseCase {
    constructor(
        orderRepository,
        cartRepository,
        userPointsRepository,
        stockMonitorService
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userPointsRepository = userPointsRepository;
        this.stockMonitorService = stockMonitorService;
    }

    async execute(input) {
        const {
            userId,
            paymentMethod,
            shippingAddress
        } = input;

        const cartItems = await this.cartRepository.findByUserId(userId);

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        const totalAmount = cartItems.reduce(
            (sum, item) => sum + Number(item.subtotal),
            0
        );

        const orderId = await this.orderRepository.create({
            userId,
            totalAmount,
            paymentMethod: paymentMethod || 'credit_card',
            shippingAddress: shippingAddress || 'Address not provided'
        });

        for (const item of cartItems) {
            await this.orderRepository.addItem(orderId, {
                productId: item.product_id,
                quantity: item.quantity,
                unitPrice: item.price,
                subtotal: item.subtotal
            });

            await this.stockMonitorService.checkProductStockAfterSale(
                item.product_id,
                item.quantity
            );
        }

        const pointsEarned = Math.floor(totalAmount);

        await this.userPointsRepository.addPoints(
            userId,
            pointsEarned,
            'earned',
            `Pontos ganhos pelo pedido #${orderId}`,
            orderId,
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        );

        await this.orderRepository.updateStatus(orderId, 'pending');

        await this.cartRepository.clear(userId);

        return {
            orderId,
            totalAmount
        };
    }
}

module.exports = CreateOrderUseCase;
