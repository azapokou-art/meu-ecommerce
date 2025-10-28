const { pool } = require('../config/database');

class Product {
    static async create(productData) {
        const { name, description, price, stock_quantity, category_id, image_url, featured } = productData;
        
        const sql = `
            INSERT INTO products (name, description, price, stock_quantity, category_id, image_url, featured) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [
            name, description, price, stock_quantity, category_id, image_url, featured
        ]);
        return result.insertId;
    }

    static async findAll() {
        const sql = 'SELECT * FROM products WHERE active = TRUE ORDER BY created_at DESC';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM products WHERE id = ? AND active = TRUE';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

    static async update(id, productData) {
        const { name, description, price, stock_quantity, category_id, image_url, featured } = productData;
        
        const sql = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url = ?, featured = ?
            WHERE id = ?
        `;
        
        const [result] = await pool.execute(sql, [
            name, description, price, stock_quantity, category_id, image_url, featured, id
        ]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const sql = 'UPDATE products SET active = FALSE WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;