class GetProductsByCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute({ categoryId }) {
        if (!categoryId) {
            throw new Error('Category ID is required');
        }

        const products = await this.categoryRepository.getProductsByCategoryId(categoryId);
        return products;
    }
}
module.exports = GetProductsByCategoryUseCase;