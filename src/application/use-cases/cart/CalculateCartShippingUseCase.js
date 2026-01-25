class CalculateCartShippingUseCase {
    constructor(cartRepository, shippingService) {
        this.cartRepository = cartRepository;
        this.shippingService = shippingService;
    }

    async execute({ cartId, shippingMethodId }) {
        if (!shippingMethodId) {
            throw new Error('Shipping Method ID is required');
        }

        const items = await this.cartRepository.findByCartId(cartId);

        if (!items || items.length === 0) {
            throw new Error('Cart is empty');
        }

        const shipping = await this.shippingService.calculate(items, shippingMethodId);

        const subtotal = items.reduce((sum, item) => {
            return sum + Number(item.subtotal)
        }, 0);

        const total = subtotal + Number(shipping.price);

        return {
            items,
            subtotal,
            shipping,
            total
        };
    }
}

module.exports = CalculateCartShippingUseCase;