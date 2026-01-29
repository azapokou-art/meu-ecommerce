class CreateProductUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute({
        name, description, price, stock_quantity, category_id, image_url, featured
    }) {
        if (!name) {
            throw new Error('Product name is required');
        }

        if (price === undefined || price === null) {
            throw new Error('Product price is required');
        }

        const product = {
            name,
            description: description || '',
            price: Number(price),
            stock_quantity: stock_quantity ? Number(stock_quantity) : 0,
            category_id: category_id || null,
            image_url: image_url || '',
            featured: Boolean(featured)
        };

        const productId = await this.productRepository.create(product);

        return productId;
    }
}

module.exports = CreateProductUseCase;

