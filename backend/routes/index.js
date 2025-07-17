const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const productRoutes = require('./products');
const cartRoutes = require('./cart');
const orderRoutes = require('./orders');
const categoryRoutes = require('./categories');
const brandRoutes = require('./brands');
const departmentRoutes = require('./departments');
const reviewRoutes = require('./reviews');
const wishlistRoutes = require('./wishlist');
const addressRoutes = require('./addresses');
const countryRoutes = require('./countries');
const stateRoutes = require('./states');
const cityRoutes = require('./cities');
const colorRoutes = require('./colors');
const sizeRoutes = require('./sizes');
const materialRoutes = require('./materials');
const couponRoutes = require('./coupons');
const adminRoutes = require('./admin');

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);


router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/departments', departmentRoutes);
router.use('/addresses', addressRoutes);
router.use('/countries', countryRoutes);
router.use('/states', stateRoutes);
router.use('/cities', cityRoutes);
router.use('/colors', colorRoutes);
router.use('/sizes', sizeRoutes);
router.use('/materials', materialRoutes);
router.use('/coupons', couponRoutes);
router.use('/admin', adminRoutes);

module.exports = router; 