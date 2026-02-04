class ValidateCouponUseCase {
    constructor(couponRepository, cartRepository) {
        this.couponRepository = couponRepository;
        this.cartRepository = cartRepository;
    }

    async execute(input) {
        const { code, userId } = input;

        if (!code) {
            throw new Error('Coupon code is required');
        }

        const cartItems = await this.cartRepository.findByUserId(userId);

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        const cartTotal = cartItems.reduce(
            (sum, item) => sum + Number(item.subtotal), 0
        );

        const validation = await this.couponRepository.validateCoupon(
            code.toUpperCase(), cartTotal
        );

        if (!validation.valid) {
            throw new Error(validation.message);
        }

        const discountResult = await this.couponRepository.calculateDiscount(
            validation.coupon, cartTotal
        );

        return {
            coupon: {
                id: validation.coupon.id,
                code: validation.coupon.code,
                description: validation.coupon.description,
                discount_type: validation.coupon.discount_type,
                discount_value: validation.coupon.discount_value,
            },

            cart: {
                originalTotal: cartTotal,
                discount: discountResult.discount,
                finalTotal: discountResult.finalTotal,
                freeShipping: discountResult.freeShipping
            }
        };
    }
}

module.exports = ValidateCouponUseCase;