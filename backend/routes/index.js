const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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
const sizeChartRoutes = require('./sizeCharts');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/categories'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Image upload endpoint
router.post('/upload/category-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ path: `/uploads/categories/${req.file.filename}` });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/size-charts', sizeChartRoutes);

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