class CreateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute({ name, description, image_url }) {
        if (!name) {
            throw new Error('Category name is required');
        }
        const category = {
            name,
            description: description || '',
            image_url: image_url || ''
        };

        const categoryId = await this.categoryRepository.create(category);

        return categoryId;
    }
}

module.exports = CreateCategoryUseCase;