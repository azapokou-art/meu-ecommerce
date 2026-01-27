const CategoryRepositoryImpl = require('../infrastructure/database/repositories/CategoryRepositoryImpl');

const CreateCategoryUseCase = require('../application/use-cases/category/CreateCategoryUseCase');
const GetAllCategoriesUseCase = require('../application/use-cases/category/GetAllCategoriesUseCase');
const GetCategoryByIdUseCase = require('../application/use-cases/category/GetCategoryByIdUseCase');
const GetProductsByCategoryUseCase = require('../application/use-cases/category/GetProductsByCategoryUseCase');

const categoryRepository = new CategoryRepositoryImpl();

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(categoryRepository);

const categoryHandler = {

    async create(req, res) {
        try {
            const categoryId = await createCategoryUseCase.execute(req.body);

            return res.status(201).json({
                message: 'Category created successfully',
                categoryId
            });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const categories = await getAllCategoriesUseCase.execute();

            return res.json({
                message: 'Categories retrieved successfully',
                categories,
                count: categories.length
            });

        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getById(req, res) {
        try {
            const category = await getCategoryByIdUseCase.execute({
                id: req.params.id
            });

            return res.json({
                message: 'Category retrieved successfully',
                category
            });

        } catch (error) {
            if (error.message === 'Category not found') {
                return res.status(404).json({ error: error.message });
            }

            return res.status(400).json({ error: error.message });
        }
    },

    async getProducts(req, res) {
        try {
            const products = await getProductsByCategoryUseCase.execute({
                categoryId: req.params.id
            });

            return res.json({
                message: 'Category products retrieved successfully',
                products,
                count: products.length
            });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};

module.exports = categoryHandler;