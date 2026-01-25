class UpdateCartItemQuantityUseCase {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute({cartId, productId, quantity}) {
        if (!productId) {
            throw new Error('Product ID is required');
        }
        if (quantity < 1) {
            throw new Error('Invalid quantity');
        }
        const existingItem = await this.cartRepository.findItem(cartId, productId);
        if (!existingItem) {
            throw new Error('Item not found in cart');
        }
        await this.cartRepository.updateItemQuantity(cartId, productId, quantity);
        return true;
    }
}

module.exports = UpdateCartItemQuantityUseCase;