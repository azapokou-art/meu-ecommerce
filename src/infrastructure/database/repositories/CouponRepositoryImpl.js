const CouponRepositoryImpl = require('../../../domain/repositories/CouponRepository');
const db = require('../../database');

class CouponRepositoryImpl extends CouponRepository {
    async findByCode(code) {
        const [rows] = await db.execute(
            'SELECT * FROM coupons WHERE code = ? LIMIT 1',
            [code]
        );
        
        return rows.length ? rows[0] : null;
    }

    async create(couponData) {
        const { code,
            description,
            discount_type,
            discount_value,
            minimum_amount,
            max_uses,
            valid_until } = couponData;
        
            const [result] = await db.execute(
            'INSERT INTO coupons (code, description, discount_type, discount_value, minimum_amount, max_uses, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [code, description, discount_type, discount_value, minimum_amount, max_uses, valid_until]
        );

        return result.insertId;
    }

    async update(couponId, couponData) {
        const fields = [];
        const values = [];

        for ( const key in couponData ) {
            if (couponData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(couponData[key]);
            }
        }

        if (fields.length === 0) return false;

        values.push(couponId);

        const [result] = await db.execute(
            `UPDATE coupons SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    async validateCoupon(code, cartTotal) {
        const coupon = await this.findByCode(code);
       
        if(!coupon) {
            return { valid: false, error: 'Coupon not found' };
        }

        if (!coupon.active) {
            return { valid: false, error: 'Coupon is inactive' };
        }

        if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
            return { valid: false, error: 'Coupon has expired' };
        }

        if (coupon.minimum_amount && cartTotal < coupon.minimum_amount) {
            return { valid: false, error: 'Coupon usage limit reached' };
        }

        return { valid: true, coupon };
    }

    async calculateDiscount(coupon, cartTotal) {
        let discount = 0;
        let freeShipping = false;

        if (coupon.discount_type === 'percentage') {
            discount = (cartTotal * coupon.discount_value) / 100;
        }

        if (coupon.discount_type === 'fixed') {
            discount = coupon.discount_value;
        }

        if (coupon.discount_type === 'free_shipping') {
            freeShipping = true;
        }

        return {
            discount,
            finalTotal,
            freeShipping
        };
    }

    async incrementUse(couponId) {
        await db.execute(
            'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
            [couponId]
        );
    }
}
module.exports = CouponRepositoryImpl;