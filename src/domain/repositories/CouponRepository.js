class CouponRepository {

    findByCode(code) {
        throw new Error('Method not implemented.');
    }

    create(couponData) {
        throw new Error('Method not implemented.');
    }

    findALL() {
        throw new Error('Method not implemented.');
    }

    update(couponId, updateData) {
        throw new Error('Method not implemented.');
    }

    validateCoupon(code, cartTotal) {
        throw new Error('Method not implemented.');
    }

    calculateDiscount(coupon, cartTotal) {
        throw new Error('Method not implemented.');
    }

    incrementUse(couponId) {
        throw new Error('Method not implemented.');
    }
}
module.exports = CouponRepository;