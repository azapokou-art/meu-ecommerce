const { pool } = require('../infrastructure/database');

class Wishlist {
    static async addItem(userId, productId) {
        const sql = `
            INSERT INTO wishlist (user_id, product_id, created_at) 
            VALUES (?, ?, NOW())
        `;
        const [result] = await pool.execute(sql, [userId, productId]);
        return result.insertId;
    }

    static async removeItem(userId, productId) {
        const sql = 'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?';
        const [result] = await pool.execute(sql, [userId, productId]);
        return result.affectedRows > 0;
    }

    static async getUserWishlist(userId) {
        const sql = `
            SELECT w.*, p.name, p.price, p.image_url, p.description 
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `;
        const [rows] = await pool.execute(sql, [userId]);
        return rows;
    }

    static async isInWishlist(userId, productId) {
        const sql = 'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?';
        const [rows] = await pool.execute(sql, [userId, productId]);
        return rows.length > 0;
    }
}

module.exports = Wishlist;