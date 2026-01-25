class GetCartUseCase {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }

    async execute({ cartId }) {
        const items = await this.cartRepository.findByCartId(cartId);

        if (!items || items.length === 0) {
            return { items: [], total: 0 }
        }
        

        const total = items.reduce((sum, item) => {
            return sum + Number(item.subtotal)
        }, 0);

        return { items, total }
    }
}


module.exports = GetCartUseCase;