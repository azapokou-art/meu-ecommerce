const { pool } = require('../config/database');

class Review {

    static async create(reviewData) {
        const { userId, productId, rating, comment } = reviewData;
        
        const sql = `
            INSERT INTO reviews (user_id, product_id, rating, comment) 
            VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [userId, productId, rating, comment]);
        return result.insertId;
    }

   
    static async findByProductId(productId) {
        const sql = `
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `;
        const [rows] = await pool.execute(sql, [productId]);
        return rows;
    }

   
    static async findByUserAndProduct(userId, productId) {
        const sql = 'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?';
        const [rows] = await pool.execute(sql, [userId, productId]);
        return rows[0];
    }

   
    static async getProductAverageRating(productId) {
        const sql = 'SELECT AVG(rating) as average_rating, COUNT(*) as review_count FROM reviews WHERE product_id = ?';
        const [rows] = await pool.execute(sql, [productId]);
        return rows[0];
    }

    
    static async findByUserId(userId) {
        const sql = `
            SELECT r.*, p.name as product_name, p.image_url
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `;
        const [rows] = await pool.execute(sql, [userId]);
        return rows;
    }
}

module.exports = Review;