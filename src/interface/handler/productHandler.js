const ProductRepositoryImpl = require('../infrastructure/database/repositories/ProductRepositoryImpl');

const CreateProductUseCase = require('../application/use-cases/product/CreateProductUseCase');
const GetAllProductsUseCase = require('../application/use-cases/product/GetAllProductsUseCase');
const GetProductByIdUseCase = require('../application/use-cases/product/GetProductByIdUseCase');
const SearchProductsUseCase = require('../application/use-cases/product/SearchProductsUseCase');

const productRepository = new ProductRepositoryImpl();

const createProductUseCase = new CreateProductUseCase(productRepository);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const searchProductsUseCase = new SearchProductsUseCase(productRepository);

const productHandler = {

    async create(req, res) {
        try {
            const productId = await createProductUseCase.execute(req.body);

            res.status(201).json({
                message: 'Product created successfully',
                productId
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const products = await getAllProductsUseCase.execute();

            res.json({
                message: 'Products retrieved successfully',
                products,
                count: products.length
            });

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getById(req, res) {
        try {
            const product = await getProductByIdUseCase.execute({
                productId: req.params.id
            });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({
                message: 'Product retrieved successfully',
                product
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async search(req, res) {
        try {
            const result = await searchProductsUseCase.execute(req.query);

            res.json({
                message: 'Products retrieved successfully',
                products: result.products,
                pagination: result.pagination
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

};

module.exports = productHandler;
