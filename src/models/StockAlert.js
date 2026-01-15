const { pool } = require('../infrastructure/database');

class StockAlert {
   
    static async createAlert(productId, currentStock, minStockLevel, alertMessage) {
        const sql = `
            INSERT INTO stock_alerts (product_id, current_stock, min_stock_level, alert_message) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [productId, currentStock, minStockLevel, alertMessage]);
        return result.insertId;
    }

    
    static async getPendingAlerts() {
        const sql = `
            SELECT sa.*, p.name as product_name, p.image_url
            FROM stock_alerts sa
            JOIN products p ON sa.product_id = p.id
            WHERE sa.status = 'pending'
            ORDER BY sa.created_at DESC
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    
    static async resolveAlert(alertId, resolvedBy) {
        const sql = `
            UPDATE stock_alerts 
            SET status = 'resolved', resolved_at = NOW(), resolved_by = ?
            WHERE id = ? AND status = 'pending'
        `;
        const [result] = await pool.execute(sql, [resolvedBy, alertId]);
        return result.affectedRows > 0;
    }

    
    static async hasPendingAlert(productId) {
        const sql = 'SELECT id FROM stock_alerts WHERE product_id = ? AND status = "pending"';
        const [rows] = await pool.execute(sql, [productId]);
        return rows.length > 0;
    }

     
    static async getAlertHistory() {
        const sql = `
            SELECT sa.*, p.name as product_name, u.name as resolved_by_name
            FROM stock_alerts sa
            JOIN products p ON sa.product_id = p.id
            LEFT JOIN users u ON sa.resolved_by = u.id
            ORDER BY sa.created_at DESC
            LIMIT 50
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = StockAlert;