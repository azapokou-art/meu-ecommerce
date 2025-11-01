const { pool } = require('../config/database');

class UserPoints {
  
    static async addPoints(userId, points, type, description, orderId = null, expiresAt = null) {
        const sql = `
            INSERT INTO user_points (user_id, points, type, description, order_id, expires_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [userId, points, type, description, orderId, expiresAt]);
        return result.insertId;
    }


    static async getBalance(userId) {
        const sql = `
            SELECT 
                SUM(CASE WHEN type = 'earned' THEN points ELSE 0 END) - 
                SUM(CASE WHEN type IN ('redeemed', 'expired') THEN points ELSE 0 END) as balance
            FROM user_points 
            WHERE user_id = ? 
            AND (expires_at IS NULL OR expires_at > CURDATE())
        `;
        const [rows] = await pool.execute(sql, [userId]);
        return rows[0]?.balance || 0;
    }

  
static async getHistory(userId) {
    const sql = `
        SELECT up.*, o.id as order_id
        FROM user_points up
        LEFT JOIN orders o ON up.order_id = o.id
        WHERE up.user_id = ?
        ORDER BY up.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
}
}

module.exports = UserPoints;