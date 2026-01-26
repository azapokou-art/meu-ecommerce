const db = require('../../database');

class CartRepositoryImpl {
    async findByCartId(cartId) {
        const sql = `
            SELECT product_id, quantity, subtotal FROM cart_items WHERE cart_id = ?`;

        const [rows] = await db.pool.execute(sql, [cartId]);
        return rows;
    }

    async findItem(cartId, productId) {
        const sql = `
            SELECT product_id, quantity, subtotal FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1`;

        const [rows] = await db.pool.execute(sql, [cartId, productId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async addItem(cartId, productId, quantity, subtotal) {
        const sql = `
            INSERT INTO cart_items (cart_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;

        await db.pool.execute(sql, [cartId, productId, quantity, subtotal]);
    }

    async updateQuantity(cartId, productId, quantity, subtotal) {
        const sql = `
            UPDATE cart_items SET quantity = ?, subtotal = ? WHERE cart_id = ? AND product_id = ?`;

        await db.pool.execute(sql, [quantity, subtotal, cartId, productId]);
    }

    async removeItem(cartId, productId) {
        const sql = `
            DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`;

        await db.pool.execute(sql, [cartId, productId]);
    }
}

module.exports = CartRepositoryImpl;
