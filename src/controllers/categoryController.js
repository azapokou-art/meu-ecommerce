const Category = require('../models/Category');

const categoryController = {
    async create(req, res) {
        try {
            const { name, description, image_url } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Category name is required' });
            }

            const categoryId = await Category.create({
                name,
                description: description || '',
                image_url: image_url || ''
            });

            res.status(201).json({ 
                message: 'Category created successfully',
                categoryId: categoryId 
            });

        } catch (error) {
            console.error('Create category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAll(req, res) {
        try {
            const categories = await Category.findAll();
            res.json({
                message: 'Categories retrieved successfully',
                categories: categories,
                count: categories.length
            });
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json({
                message: 'Category retrieved successfully',
                category: category
            });
        } catch (error) {
            console.error('Get category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getProducts(req, res) {
        try {
            const { id } = req.params;
            const products = await Category.findProductsByCategory(id);

            res.json({
                message: 'Category products retrieved successfully',
                products: products,
                count: products.length
            });
        } catch (error) {
            console.error('Get category products error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = categoryController;