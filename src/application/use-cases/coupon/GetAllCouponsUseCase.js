class GetAllCouponsUseCase {
  constructor(couponRepository) {
    this.couponRepository = couponRepository;
  }

  async execute() {
    const coupons = await this.couponRepository.findAll();
    return coupons;
  }
}

module.exports = GetAllCouponsUseCase;