class GetProductByIdUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute({ productId }) {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        const product = await this.productRepository.findById(productId);
        return product;
    }
}

module.exports = GetProductByIdUseCase;