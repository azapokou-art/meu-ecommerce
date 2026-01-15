const { pool } = require('../infrastructure/database');

class Shipping {

    static async findAll() {
        const sql = 'SELECT * FROM shipping_methods WHERE active = TRUE ORDER BY price ASC';
        const [rows] = await pool.execute(sql);
        return rows;
    }

 
    static async findById(id) {
        const sql = 'SELECT * FROM shipping_methods WHERE id = ? AND active = TRUE';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

 
    static async calculateShipping(shippingMethodId) {
        const shippingMethod = await Shipping.findById(shippingMethodId);
        
        if (!shippingMethod) {
            throw new Error('Método de entrega não encontrado');
        }

        return {
            method: shippingMethod.name,
            price: shippingMethod.price,
            delivery_days: shippingMethod.delivery_days,
            estimated_delivery: new Date(Date.now() + shippingMethod.delivery_days * 24 * 60 * 60 * 1000)
        };
    }


    static async calculateCartShipping(cartItems, shippingMethodId) {
        const shipping = await Shipping.calculateShipping(shippingMethodId);
        
        
        return shipping;
    }
}

module.exports = Shipping;