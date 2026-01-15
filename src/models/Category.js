const { pool } = require('../infrastructure/database');

class Category {
 
    static async create(categoryData) {
        const { name, description, image_url } = categoryData;
        
        const sql = `
            INSERT INTO categories (name, description, image_url) 
            VALUES (?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [name, description, image_url]);
        return result.insertId;
    }

  
    static async findAll() {
        const sql = 'SELECT * FROM categories WHERE active = TRUE ORDER BY name';
        const [rows] = await pool.execute(sql);
        return rows;
    }


    static async findById(id) {
        const sql = 'SELECT * FROM categories WHERE id = ? AND active = TRUE';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }


    static async findProductsByCategory(categoryId) {
        const sql = `
            SELECT p.* 
            FROM products p 
            WHERE p.category_id = ? AND p.active = TRUE 
            ORDER BY p.created_at DESC
        `;
        const [rows] = await pool.execute(sql, [categoryId]);
        return rows;
    }


    static async update(id, categoryData) {
        const { name, description, image_url } = categoryData;
        
        const sql = `
            UPDATE categories 
            SET name = ?, description = ?, image_url = ?
            WHERE id = ?
        `;
        
        const [result] = await pool.execute(sql, [name, description, image_url, id]);
        return result.affectedRows > 0;
    }


    static async delete(id) {
        const sql = 'UPDATE categories SET active = FALSE WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Category;