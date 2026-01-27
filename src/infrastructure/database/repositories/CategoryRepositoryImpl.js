const CategoryRepository = require('../../../domain/repositories/CategoryRepository');
const db = require('../database');

class CategoryRepositoryImpl extends CategoryRepository {

    async create(category) {
        const { name, description, image_url } = category;

        const [result] = await db.pool.execute(
            'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
            [name, description, image_url]
        );

        return result.insertId;
    }

    async findAll() {
        const [rows] = await db.pool.execute(
            'SELECT id, name, description, image_url FROM categories'
        );

        return rows;
    }

    async findById(id) {
        const [rows] = await db.pool.execute(
            'SELECT id, name, description, image_url FROM categories WHERE id = ?',
            [id]
        );

        return rows.length === 0 ? null : rows[0];
    }

    async findProductsByCategory(categoryId) {
        const [rows] = await db.pool.execute(
            `
            SELECT 
                p.id,
                p.name,
                p.price,
                p.image_url
            FROM products p
            WHERE p.category_id = ?
            `,
            [categoryId]
        );

        return rows;
    }
}

module.exports = CategoryRepositoryImpl;
