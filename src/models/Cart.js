const { pool } = require('../config/database');

class Cart {
    static async addItem(userId, productId, quantity = 1) {
        const sql = `
            INSERT INTO cart_items (user_id, product_id, quantity) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + ?
        `;
        
        const [result] = await pool.execute(sql, [userId, productId, quantity, quantity]);
        return result.affectedRows > 0;
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT 
                ci.*,
                p.name,
                p.price,
                p.image_url,
                (ci.quantity * p.price) as subtotal
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
            ORDER BY ci.created_at DESC
        `;
        const [rows] = await pool.execute(sql, [userId]);
        return rows;
    }

    static async updateQuantity(userId, productId, quantity) {
        const sql = 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?';
        const [result] = await pool.execute(sql, [quantity, userId, productId]);
        return result.affectedRows > 0;
    }

    static async removeItem(userId, productId) {
        const sql = 'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?';
        const [result] = await pool.execute(sql, [userId, productId]);
        return result.affectedRows > 0;
    }

    static async clear(userId) {
        const sql = 'DELETE FROM cart_items WHERE user_id = ?';
        const [result] = await pool.execute(sql, [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = Cart;