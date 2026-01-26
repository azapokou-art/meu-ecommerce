const Product = require('../models/Product');
const upload = require('../infrastructure/upload');

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
    },

    async search(req, res) {
        try {
            const {
                name,
                category_id,
                min_price,
                max_price,
                featured,
                sort_by = 'created_at',
                sort_order = 'desc',
                page = 1,
                limit = 10
            } = req.query;

        
            const filters = {};
            
            if (name) filters.name = name;
            if (category_id) filters.category_id = parseInt(category_id);
            if (min_price) filters.min_price = parseFloat(min_price);
            if (max_price) filters.max_price = parseFloat(max_price);
            if (featured !== undefined) filters.featured = featured === 'true';
            if (sort_by) filters.sort_by = sort_by;
            if (sort_order) filters.sort_order = sort_order;

         
            const offset = (parseInt(page) - 1) * parseInt(limit);
            filters.limit = parseInt(limit);
            filters.offset = offset;

        
            const products = await Product.search(filters);
            const total = await Product.count(filters);
            const totalPages = Math.ceil(total / parseInt(limit));

            res.json({
                message: 'Products retrieved successfully',
                products: products,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: totalPages,
                    total_products: total,
                    per_page: parseInt(limit),
                    has_next: parseInt(page) < totalPages,
                    has_prev: parseInt(page) > 1
                },
                filters: filters
            });

        } catch (error) {
            console.error('Search products error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhuma imagem enviada' });
            }

            const imageUrl = `/uploads/products/${req.file.filename}`;
            
            res.json({
                message: 'Imagem enviada com sucesso',
                imageUrl: imageUrl
            });

        } catch (error) {
            console.error('Upload image error:', error);
            res.status(500).json({ error: 'Erro no upload da imagem' });
        }
    }
};

module.exports = productController;