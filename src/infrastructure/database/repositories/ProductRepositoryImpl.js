const ProductRepository = require('../../domain/repositories/ProductRepository');
const db = require('../database');

class ProductRepositoryImpl extends ProductRepository {

    async create(product) {
        const { name, description, price, stock_quantity, category_id, image_url, featured } = product;
        const [result] = await db.pool.execute(
            'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, category_id, image_url, featured]
        );
        return result.insertId;
    }

    async findAll() {
        const [rows] = await db.pool.execute(
            'SELECT id, name, description, price, stock_quantity, category_id, image_url, featured FROM products'
        );
        return rows;
    }

    async findById(id) {
        const [rows] = await db.pool.execute(
            'SELECT id, name, description, price, stock_quantity, category_id, image_url, featured FROM products WHERE id = ?',
            [id]
        );
        return rows.length === 0 ? null : rows[0];
    }

    async search(filters) {
        const conditions = [];
        const values = [];

        if (filters.name) {
            conditions.push('name LIKE ?');
            values.push(`%${filters.name}%`);
        }

        if (filters.category_id) {
            conditions.push('category_id = ?');
            values.push(filters.category_id);
        }

        if (filters.featured !== undefined) {
            conditions.push('featured = ?');
            values.push(filters.featured);
        }

        if (filters.min_price !== undefined) {
            conditions.push('price >= ?');
            values.push(filters.min_price);
        }

        if (filters.max_price !== undefined) {
            conditions.push('price <= ?');
            values.push(filters.max_price);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const orderBy = filters.sort_by ? `ORDER BY ${filters.sort_by} ${filters.sort_order || 'ASC'}`
            : '';

            const limit = filters.limit ? 'LIMIT ? OFFSET ?' : '';
            if (filters.limit) {
            values.push(filters.limit, filters.offset || 0);
        }

        const [rows] = await db.pool.execute(
            `SELECT id, name, description, price, stock_quantity, category_id, image_url, featured FROM products ${whereClause} ${orderBy} ${limit}`,
            values
        );

        return rows;
    }

    async count(filters) {
        const conditions = [];
        const values = [];

        if (filters.name) {
            conditions.push('name LIKE ?');
            values.push(`%${filters.name}%`);
        }

        if (filters.category_id) {
            conditions.push('category_id = ?');
            values.push(filters.category_id);
        }

        if (filters.featured !== undefined) {
            conditions.push('featured = ?');
            values.push(filters.featured);
        }

        if (filters.min_price !== undefined) {
            conditions.push('price >= ?');
            values.push(filters.min_price);
        }

        if (filters.max_price !== undefined) {
            conditions.push('price <= ?');
            values.push(filters.max_price);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const [rows] = await db.pool.execute(
            `SELECT COUNT(*) as count FROM products ${whereClause}`,
            values
        );

        return rows[0].total;
    }
}

module.exports = ProductRepositoryImpl;