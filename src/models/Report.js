const { pool } = require('../config/database');

class Report {
    

static async getSalesByMonth(months = 6) {
    const sql = `
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            COUNT(*) as order_count,
            SUM(total_amount) as total_sales,
            AVG(total_amount) as avg_order_value
        FROM orders 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
    `;
    const [rows] = await pool.execute(sql, [months]);
    return rows;
}

    
static async getTopProducts(limit = 10) {
    const sql = `
        SELECT 
            p.id,
            p.name,
            p.image_url,
            SUM(oi.quantity) as total_sold,
            SUM(oi.quantity * oi.unit_price) as total_revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        GROUP BY p.id, p.name, p.image_url
        ORDER BY total_sold DESC
        LIMIT ${parseInt(limit)}
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}

    
    static async getCustomerStats() {
        const sql = `
            SELECT 
                COUNT(*) as total_customers,
                COUNT(DISTINCT o.user_id) as customers_with_orders,
                AVG(order_count) as avg_orders_per_customer,
                MAX(order_count) as max_orders
            FROM users u
            LEFT JOIN (
                SELECT user_id, COUNT(*) as order_count
                FROM orders 
                GROUP BY user_id
            ) o ON u.id = o.user_id
            WHERE u.role = 'client'
        `;
        const [rows] = await pool.execute(sql);
        return rows[0];
    }

    
    static async getFinancialMetrics() {
        const sql = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(total_amount) as total_revenue,
                AVG(total_amount) as avg_order_value,
                MIN(total_amount) as min_order_value,
                MAX(total_amount) as max_order_value
            FROM orders 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `;
        const [rows] = await pool.execute(sql);
        return rows[0];
    }

    
    static async getSalesByCategory() {
        const sql = `
            SELECT 
                c.name as category_name,
                COUNT(oi.id) as items_sold,
                SUM(oi.quantity * oi.unit_price) as total_revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN categories c ON p.category_id = c.id
            JOIN orders o ON oi.order_id = o.id
            GROUP BY c.id, c.name
            ORDER BY total_revenue DESC
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Report;