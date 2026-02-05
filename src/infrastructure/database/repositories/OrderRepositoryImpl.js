const OrderRepository = require('../../../domain/repositories/OrderRepository');
const db = require('../database');

class OrderRepositoryImpl extends OrderRepository {

    async create(orderData) {
        const {
            userId,
            totalAmount,
            paymentMethod,
            shippingAddress
        } = orderData;

        const [result] = await db.execute(
            `
            INSERT INTO orders
            (user_id, total_amount, payment_method, shipping_address, status)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                userId,
                totalAmount,
                paymentMethod,
                shippingAddress,
                'created'
            ]
        );

        return result.insertId;
    }

    async addItem(orderId, itemData) {
        const {
            productId,
            quantity,
            unitPrice,
            subtotal
        } = itemData;

        await db.execute(
            `
            INSERT INTO order_items
            (order_id, product_id, quantity, unit_price, subtotal)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                orderId,
                productId,
                quantity,
                unitPrice,
                subtotal
            ]
        );
    }

    async updateStatus(orderId, status) {
        await db.execute(
            `
            UPDATE orders
            SET status = ?
            WHERE id = ?
            `,
            [status, orderId]
        );
    }

    async findByUserId(userId) {
        const [rows] = await db.execute(
            `
            SELECT *
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return rows;
    }

    async findById(orderId) {
        const [rows] = await db.execute(
            `
            SELECT *
            FROM orders
            WHERE id = ?
            LIMIT 1
            `,
            [orderId]
        );

        return rows.length ? rows[0] : null;
    }
}

module.exports = OrderRepositoryImpl;
