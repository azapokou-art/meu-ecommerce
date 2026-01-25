class RemoveCartItemUseCase {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  async execute({ cartId, productId }) {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const existingItem = await this.cartRepository.findItem(cartId, productId);

    if (!existingItem) {
      throw new Error('Item not found in cart');
    }
    
    await this.cartRepository.removeItem(cartId, productId);
    return true;
  }
}

module.exports = RemoveCartItemUseCase;