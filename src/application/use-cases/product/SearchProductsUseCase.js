class SearchProductsUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(filters) {
        const normalizedFilters = {
            name: filters.name || undefined,
            category_id: filters.category_id ? Number(filters.category_id) : undefined,
            min_price: filters.min_price ? Number(filters.min_price) : undefined,
            max_price: filters.max_price ? Number(filters.max_price) : undefined,
            featured: filters.featured !== undefined ? Boolean(filters.featured) : undefined,
            sort_by: filters.sort_by || 'created_at',
            sort_order: filters.sort_order || 'desc',
            limit: filters.limit ? Number(filters.limit) : 10,
            offset: filters.page
                ? (Number(filters.page) - 1) * Number(filters.limit || 10)
                : 0
        };

        const products = await this.productRepository.search(normalizedFilters);
        const total = await this.productRepository.count(normalizedFilters);

        const totalPages = Math.ceil(total / normalizedFilters.limit);

        return {
            products,
            pagination: {
                total,
                total_pages: totalPages,
                per_page: normalizedFilters.limit,
                current_page: Math.floor(normalizedFilters.offset / normalizedFilters.limit) + 1,
                has_next: normalizedFilters.offset + normalizedFilters.limit < total,
                has_prev: normalizedFilters.offset > 0
            }
        };
    }
}

module.exports = SearchProductsUseCase;
