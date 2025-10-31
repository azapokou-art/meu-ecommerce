const { pool } = require('../config/database');

class Coupon {
 
    static async create(couponData) {
        const { code, description, discount_type, discount_value, minimum_amount, max_uses, valid_until } = couponData;
        
        const sql = `
            INSERT INTO coupons (code, description, discount_type, discount_value, minimum_amount, max_uses, valid_until) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sql, [
            code, description, discount_type, discount_value, minimum_amount, max_uses, valid_until
        ]);
        return result.insertId;
    }

  
    static async findByCode(code) {
        const sql = `
            SELECT * FROM coupons 
            WHERE code = ? 
            AND active = TRUE 
            AND (valid_until IS NULL OR valid_until > NOW())
            AND (max_uses IS NULL OR used_count < max_uses)
        `;
        const [rows] = await pool.execute(sql, [code]);
        return rows[0];
    }


    static async findAll() {
        const sql = 'SELECT * FROM coupons ORDER BY created_at DESC';
        const [rows] = await pool.execute(sql);
        return rows;
    }

 
    static async findById(id) {
        const sql = 'SELECT * FROM coupons WHERE id = ?';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }


    static async validateCoupon(code, cartTotal) {
        const coupon = await Coupon.findByCode(code);
        
        if (!coupon) {
            return { valid: false, error: 'Cupom não encontrado ou inválido' };
        }

 
        if (cartTotal < coupon.minimum_amount) {
            return { 
                valid: false, 
                error: `Valor mínimo para este cupom: R$ ${coupon.minimum_amount}` 
            };
        }

        return { valid: true, coupon };
    }

  
    static async calculateDiscount(coupon, cartTotal) {
        let discount = 0;
        let finalTotal = cartTotal;

        switch (coupon.discount_type) {
            case 'percentage':
                discount = (cartTotal * coupon.discount_value) / 100;
                finalTotal = cartTotal - discount;
                break;
            
            case 'fixed':
                discount = coupon.discount_value;
                finalTotal = cartTotal - discount;
                break;
            
            case 'free_shipping':
                discount = 0; 
                finalTotal = cartTotal;
                break;
        }

    
        if (finalTotal < 0) {
            finalTotal = 0;
            discount = cartTotal;
        }

        return {
            discount: parseFloat(discount.toFixed(2)),
            finalTotal: parseFloat(finalTotal.toFixed(2)),
            freeShipping: coupon.discount_type === 'free_shipping'
        };
    }

 
    static async incrementUse(id) {
        const sql = 'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?';
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows > 0;
    }

   
    static async update(id, updateData) {
        const { description, discount_type, discount_value, minimum_amount, max_uses, valid_until, active } = updateData;
        
        const sql = `
            UPDATE coupons 
            SET description = ?, discount_type = ?, discount_value = ?, minimum_amount = ?, max_uses = ?, valid_until = ?, active = ?
            WHERE id = ?
        `;
        
        const [result] = await pool.execute(sql, [
            description, discount_type, discount_value, minimum_amount, max_uses, valid_until, active, id
        ]);
        return result.affectedRows > 0;
    }
}

module.exports = Coupon;