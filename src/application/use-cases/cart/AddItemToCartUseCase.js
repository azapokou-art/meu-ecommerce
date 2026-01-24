class AddItemToCartUseCase {
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(cartId, productId, quantity) {
        if(!productId) {
            throw new Error('Product ID is required');
        }
        const validQuantity = quantity && quantity > 0 ? quantity : 1;

        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (existingItem) {
            const newQuantity = existingItem.quantity + validQuantity;
            await this.cartRepository.updateItemQuantity(cartId, productId, newQuantity);
        return { updated: true };

        }
        await this.cartRepository.addItem(cartId, productId, validQuantity);
        return { created: true };
    }
}
module.exports = AddItemToCartUseCase;