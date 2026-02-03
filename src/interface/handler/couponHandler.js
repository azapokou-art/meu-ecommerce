const Coupon = require('../models/Coupon');

const couponHandler = {
   
    async create(req, res) {
        try {
            const { code, description, discount_type, discount_value, minimum_amount, max_uses, valid_until } = req.body;

        
            if (!code || !discount_type) {
                return res.status(400).json({ error: 'Code and discount type are required' });
            }

            if (discount_type !== 'free_shipping' && !discount_value) {
                return res.status(400).json({ error: 'Discount value is required for this discount type' });
            }

         
            const existingCoupon = await Coupon.findByCode(code);
            if (existingCoupon) {
                return res.status(400).json({ error: 'Coupon code already exists' });
            }

            const couponId = await Coupon.create({
                code: code.toUpperCase(),
                description,
                discount_type,
                discount_value: discount_value || 0,
                minimum_amount: minimum_amount || 0,
                max_uses,
                valid_until: valid_until || null
            });

            res.status(201).json({
                message: 'Coupon created successfully',
                couponId: couponId
            });

        } catch (error) {
            console.error('Create coupon error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

  
    async validate(req, res) {
        try {
            const { code } = req.body;
            const userId = req.user.userId;

            if (!code) {
                return res.status(400).json({ error: 'Coupon code is required' });
            }

        
            const Cart = require('../models/Cart');
            const cartItems = await Cart.findByUserId(userId);
            
            if (cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const cartTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

        
            const validation = await Coupon.validateCoupon(code.toUpperCase(), cartTotal);

            if (!validation.valid) {
                return res.status(400).json({ error: validation.error });
            }

        
            const discountResult = await Coupon.calculateDiscount(validation.coupon, cartTotal);

            res.json({
                message: 'Coupon applied successfully',
                coupon: {
                    id: validation.coupon.id,
                    code: validation.coupon.code,
                    description: validation.coupon.description,
                    discount_type: validation.coupon.discount_type,
                    discount_value: validation.coupon.discount_value
                },
                cart: {
                    originalTotal: cartTotal.toFixed(2),
                    discount: discountResult.discount.toFixed(2),
                    finalTotal: discountResult.finalTotal.toFixed(2),
                    freeShipping: discountResult.freeShipping
                }
            });

        } catch (error) {
            console.error('Validate coupon error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

  
    async getAll(req, res) {
        try {
            const coupons = await Coupon.findAll();

            res.json({
                message: 'Coupons retrieved successfully',
                coupons: coupons,
                count: coupons.length
            });

        } catch (error) {
            console.error('Get coupons error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

  
    async update(req, res) {
        try {
            const { couponId } = req.params;
            const { description, discount_type, discount_value, minimum_amount, max_uses, valid_until, active } = req.body;

            const success = await Coupon.update(couponId, {
                description,
                discount_type,
                discount_value,
                minimum_amount,
                max_uses,
                valid_until,
                active
            });

            if (!success) {
                return res.status(404).json({ error: 'Coupon not found' });
            }

            res.json({
                message: 'Coupon updated successfully'
            });

        } catch (error) {
            console.error('Update coupon error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

 
    async applyToOrder(orderData, couponCode) {
        try {
            if (!couponCode) return orderData;

            const validation = await Coupon.validateCoupon(couponCode, orderData.totalAmount);
            
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            const discountResult = await Coupon.calculateDiscount(validation.coupon, orderData.totalAmount);

         
            await Coupon.incrementUse(validation.coupon.id);

            return {
                ...orderData,
                couponId: validation.coupon.id,
                couponCode: validation.coupon.code,
                discountAmount: discountResult.discount,
                finalAmount: discountResult.finalTotal,
                freeShipping: discountResult.freeShipping
            };

        } catch (error) {
            throw new Error('Coupon application failed: ' + error.message);
        }
    }
};

module.exports = couponHandler;