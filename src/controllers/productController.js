const Product = require('../models/Product');

const productController = {
    async create(req, res) {
        try {
            const { name, description, price, stock_quantity, category_id, image_url, featured } = req.body;

            if (!name || !price) {
                return res.status(400).json({ error: 'Name and price are required' });
            }

            const productId = await Product.create({
                name,
                description: description || '',
                price: parseFloat(price),
                stock_quantity: stock_quantity || 0,
                category_id: category_id || null,
                image_url: image_url || '',
                featured: featured || false
            });

            res.status(201).json({ 
                message: 'Product created successfully',
                productId: productId 
            });

        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAll(req, res) {
        try {
            const products = await Product.findAll();
            res.json({
                message: 'Products retrieved successfully',
                products: products,
                count: products.length
            });
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({
                message: 'Product retrieved successfully',
                product: product
            });
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = productController;