const CouponRepositoryImpl = require('../../infrastructure/database/repositories/CouponRepositoryImpl');
const CartRepositoryImpl = require('../../infrastructure/database/repositories/CartRepositoryImpl');

const CreateCouponUseCase = require('../../application/use-cases/coupon/CreateCouponUseCase');
const ValidateCouponUseCase = require('../../application/use-cases/coupon/ValidateCouponUseCase');
const GetAllCouponsUseCase = require('../../application/use-cases/coupon/GetAllCouponsUseCase');
const UpdateCouponUseCase = require('../../application/use-cases/coupon/UpdateCouponUseCase');

const couponRepository = new CouponRepositoryImpl();
const cartRepository = new CartRepositoryImpl();

const createCouponUseCase = new CreateCouponUseCase(couponRepository);
const validateCouponUseCase = new ValidateCouponUseCase(
    couponRepository,
    cartRepository
);
const getAllCouponsUseCase = new GetAllCouponsUseCase(couponRepository);
const updateCouponUseCase = new UpdateCouponUseCase(couponRepository);

const couponHandler = {

    async create(req, res) {
        try {
            const couponId = await createCouponUseCase.execute(req.body);

            return res.status(201).json({
                message: 'Coupon created successfully',
                couponId
            });

        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    async validate(req, res) {
        try {
            const result = await validateCouponUseCase.execute({
                code: req.body.code,
                userId: req.user.userId
            });

            return res.json({
                message: 'Coupon applied successfully',
                coupon: result.coupon,
                cart: {
                    originalTotal: result.cart.originalTotal.toFixed(2),
                    discount: result.cart.discount.toFixed(2),
                    finalTotal: result.cart.finalTotal.toFixed(2),
                    freeShipping: result.cart.freeShipping
                }
            });

        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const coupons = await getAllCouponsUseCase.execute();

            return res.json({
                message: 'Coupons retrieved successfully',
                coupons,
                count: coupons.length
            });

        } catch (error) {
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    },

    async update(req, res) {
        try {
            await updateCouponUseCase.execute({
                couponId: req.params.couponId,
                ...req.body
            });

            return res.json({
                message: 'Coupon updated successfully'
            });

        } catch (error) {
            if (error.message === 'Coupon not found') {
                return res.status(404).json({ error: error.message });
            }

            return res.status(400).json({
                error: error.message
            });
        }
    }

};

module.exports = couponHandler;