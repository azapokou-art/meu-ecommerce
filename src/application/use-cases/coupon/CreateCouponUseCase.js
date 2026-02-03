class CreateCouponUseCase {
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }

    async execute(input) {
        const {
            code,
            description,
            discount_type,
            discount_value,
            minimum_amount,
            max_uses,
            valid_until
        } = input;

         if (!code || !discount_type) {
            throw new Error('Code and discount type are required');
        }

        if (discount_type !== 'free_shipping' && !discount_value) {
            throw new Error('Discount value is required for this discount type');
        }

        const normalizedCode = code.toUpperCase();

        const existingCoupon = await this.couponRepository.findByCode(normalizedCode);
        if (existingCoupon) {
            throw new Error('Coupon code already exists');
        }

        const couponId = await this.couponRepository.create({
            code: normalizedCode,
            description,
            discount_type,
            discount_value: discount_value || 0,
            minimum_amount: minimum_amount || 0,
            max_uses,
            valid_until: valid_until || null
        });

        return couponId;
    }}

module.exports = CreateCouponUseCase;



    