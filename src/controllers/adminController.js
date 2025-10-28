const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { pool } = require('../config/database');

const adminController = {
    async getDashboard(req, res) {
        try {
         
            const [usersCount] = await pool.execute('SELECT COUNT(*) as total FROM users');
            const [productsCount] = await pool.execute('SELECT COUNT(*) as total FROM products WHERE active = TRUE');
            const [ordersCount] = await pool.execute('SELECT COUNT(*) as total FROM orders');
            
          
            const [salesResult] = await pool.execute('SELECT SUM(total_amount) as total_sales FROM orders WHERE status IN ("paid", "delivered")');
            
          
            const recentOrders = await pool.execute(`
                SELECT o.*, u.name as user_name 
                FROM orders o 
                JOIN users u ON o.user_id = u.id 
                ORDER BY o.created_at DESC 
                LIMIT 5
            `);

            res.json({
                message: 'Dashboard data retrieved successfully',
                dashboard: {
                    users: {
                        total: usersCount[0].total
                    },
                    products: {
                        total: productsCount[0].total
                    },
                    orders: {
                        total: ordersCount[0].total
                    },
                    sales: {
                        total: salesResult[0].total_sales || 0
                    },
                    recentOrders: recentOrders[0]
                }
            });

        } catch (error) {
            console.error('Get dashboard error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUsers(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);

            const [users] = await pool.execute(`
    SELECT id, name, email, role, created_at 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT ${parseInt(limit)} OFFSET ${offset}
`);

const [total] = await pool.execute('SELECT COUNT(*) as total FROM users');

            res.json({
                message: 'Users retrieved successfully',
                users: users,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(total[0].total / parseInt(limit)),
                    total_users: total[0].total,
                    per_page: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    async getProducts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);

            const [products] = await pool.execute(`
    SELECT * FROM products 
    ORDER BY created_at DESC 
    LIMIT ${parseInt(limit)} OFFSET ${offset}
`);

            const [total] = await pool.execute('SELECT COUNT(*) as total FROM products');

            res.json({
                message: 'Products retrieved successfully',
                products: products,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(total[0].total / parseInt(limit)),
                    total_products: total[0].total,
                    per_page: parseInt(limit)
                }
            });

        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateProductStatus(req, res) {
        try {
            const { productId } = req.params;
            const { active } = req.body;

            const sql = 'UPDATE products SET active = ? WHERE id = ?';
            const [result] = await pool.execute(sql, [active, productId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({
                message: `Product ${active ? 'activated' : 'deactivated'} successfully`
            });

        } catch (error) {
            console.error('Update product status error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = adminController;