const { pool } = require('../config/database');

class Order {
    static async create(orderData) {
        const { userId, totalAmount, paymentMethod, shippingAddress } = orderData;
        
        const sql = `
            INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) 
            VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [userId, totalAmount, paymentMethod, shippingAddress]);
        return result.insertId;
    }

    static async addItem(orderId, itemData) {
        const { productId, quantity, unitPrice, subtotal } = itemData;
        
        const sql = `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [orderId, productId, quantity, unitPrice, subtotal]);
        return result.insertId;
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT o.*, 
                   COUNT(oi.id) as items_count
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const [rows] = await pool.execute(sql, [userId]);
        return rows;
    }

    static async findById(orderId) {

        const orderSql = 'SELECT * FROM orders WHERE id = ?';
        const [orderRows] = await pool.execute(orderSql, [orderId]);
        
        if (!orderRows[0]) return null;


        const itemsSql = `
            SELECT oi.*, p.name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;
        const [itemRows] = await pool.execute(itemsSql, [orderId]);

        return {
            ...orderRows[0],
            items: itemRows
        };
    }

    
    static async updateStatus(orderId, status) {
        const sql = 'UPDATE orders SET status = ? WHERE id = ?';
        const [result] = await pool.execute(sql, [status, orderId]);
        return result.affectedRows > 0;
    }
}

module.exports = Order;