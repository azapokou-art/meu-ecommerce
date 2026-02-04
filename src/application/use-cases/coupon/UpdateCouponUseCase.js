class UpdateCouponUseCase {
  constructor(couponRepository) {
    this.couponRepository = couponRepository;
  }

  async execute(input) {
    const {
        couponId,
        description,
        discount_type,
        discount_value,
        minimum_amount,
        max_uses,
        valid_until,
        active } = input;

        if (!couponId) {
            throw new Error('Coupon ID is required');
        }

        const updated = await this.couponRepository.update(couponId, {
            description,
            discount_type,
            discount_value,
            minimum_amount,
            max_uses,
            valid_until,
            active
        });

        if (!updated) {
            throw new Error('Coupon not found');
        }

        return { success: true };
  }
}

module.exports = UpdateCouponUseCase;