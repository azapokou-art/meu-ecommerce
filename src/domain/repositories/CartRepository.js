class cartRepository {
    async findByCartId(cartId) {
        throw new Error('Method not implemented');
    }

    async findItem(cartId, productId) {
        throw new Error('Method not implemented');
    }

    async addItem(cartId, productId, quantity) {
        throw new Error('Method not implemented');
    }

    async updateItemQuantity(cartId, productId, quantity) {
        throw new Error('Method not implemented');
    }
    
    async removeItem(cartId, productId) {
        throw new Error('Method not implemented');
    }
}

module.exports = cartRepository;