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


    static async search(filters = {}) {
        let sql = `SELECT * FROM products WHERE active = TRUE`;
        const params = [];

        if (filters.name) {
            sql += ' AND name LIKE ?';
            params.push(`%${filters.name}%`);
        }

        sql += ' ORDER BY created_at DESC';

    
        if (filters.limit) {
            sql += ` LIMIT ${parseInt(filters.limit)}`;
        }

     
        if (filters.offset) {
            sql += ` OFFSET ${parseInt(filters.offset)}`;
        }

        console.log('SQL:', sql);
        console.log('PARAMS:', params);

        const [rows] = await pool.execute(sql, params);
        return rows;
    }
        

 
    static async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM products WHERE active = TRUE';
        const params = [];

    
        if (filters.name) {
            sql += ' AND name LIKE ?';
            params.push(`%${filters.name}%`);
        }
                if (filters.category_id) {
            sql += ' AND category_id = ?';
            params.push(parseInt(filters.category_id));
        }
        if (filters.min_price) {
            sql += ' AND price >= ?';
            params.push(parseFloat(filters.min_price));
        }
        if (filters.max_price) {
            sql += ' AND price <= ?';
            params.push(parseFloat(filters.max_price));
        }

        if (filters.featured !== undefined) {
            sql += ' AND featured = ?';
            params.push(filters.featured);
        }

        const [rows] = await pool.execute(sql, params);
        return rows[0].total;
    }
};


module.exports = Product;