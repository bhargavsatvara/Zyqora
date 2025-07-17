const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { 
  User, Product, Category, Brand, Department, 
  Address, Country, State, City, Color, 
  Size, Material, Coupon 
} = require('../models');

// Database connection configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/Zyqora', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const sampleData = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin'
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User123!',
      role: 'user'
    }
  ],
  countries: [
    { name: 'United States', code: 'US', phoneCode: '+1' },
    { name: 'India', code: 'IN', phoneCode: '+91' }
  ],
  states: [
    { name: 'California', code: 'CA', country_id: null },
    { name: 'New York', code: 'NY', country_id: null },
    { name: 'Maharashtra', code: 'MH', country_id: null }
  ],
  cities: [
    { name: 'Los Angeles', code: 'LA', state_id: null },
    { name: 'New York City', code: 'NYC', state_id: null },
    { name: 'Mumbai', code: 'MUM', state_id: null }
  ],
  departments: [
    { name: 'Men\'s Fashion', description: 'Men\'s clothing and accessories' },
    { name: 'Women\'s Fashion', description: 'Women\'s clothing and accessories' },
    { name: 'Electronics', description: 'Electronic devices and accessories' }
  ],
  categories: [
    { name: 'T-Shirts', description: 'Casual t-shirts', department_id: null },
    { name: 'Jeans', description: 'Denim jeans', department_id: null },
    { name: 'Smartphones', description: 'Mobile phones', department_id: null }
  ],
  brands: [
    { name: 'Nike', description: 'Sports and casual wear' },
    { name: 'Apple', description: 'Technology and electronics' },
    { name: 'Samsung', description: 'Technology and electronics' }
  ],
  colors: [
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Black', code: '#000000' }
  ],
  sizes: [
    { name: 'Small', category: 'clothing', description: 'Small size' },
    { name: 'Medium', category: 'clothing', description: 'Medium size' },
    { name: 'Large', category: 'clothing', description: 'Large size' }
  ],
  materials: [
    { name: 'Cotton', description: 'Natural cotton fabric' },
    { name: 'Polyester', description: 'Synthetic polyester fabric' },
    { name: 'Leather', description: 'Genuine leather' }
  ],
  products: [
    {
      name: 'Classic T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 29.99,
      category_id: null,
      brand_id: null,
      department_id: null,
      colors: [],
      sizes: [],
      materials: [],
      stock: 100,
      images: ['tshirt1.jpg', 'tshirt2.jpg']
    },
    {
      name: 'iPhone 13',
      description: 'Latest Apple smartphone',
      price: 999.99,
      category_id: null,
      brand_id: null,
      department_id: null,
      colors: [],
      sizes: [],
      materials: [],
      stock: 50,
      images: ['iphone1.jpg', 'iphone2.jpg']
    }
  ],
  coupons: [
    {
      code: 'WELCOME10',
      discountAmount: 10,
      minimumOrderAmount: 50,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      usageLimit: 100,
      usedCount: 0
    },
    {
      code: 'FLAT20',
      discountAmount: 20,
      minimumOrderAmount: 100,
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      isActive: true,
      usageLimit: 50,
      usedCount: 0
    }
  ]
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Department.deleteMany({}),
      Address.deleteMany({}),
      Country.deleteMany({}),
      State.deleteMany({}),
      City.deleteMany({}),
      Color.deleteMany({}),
      Size.deleteMany({}),
      Material.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    // Create countries
    const countries = await Country.insertMany(sampleData.countries);

    // Create states with country references
    const states = await State.insertMany(
      sampleData.states.map((state, index) => ({
        ...state,
        country_id: countries[Math.floor(index / 2)]._id
      }))
    );

    // Create cities with state references
    const cities = await City.insertMany(
      sampleData.cities.map((city, index) => ({
        ...city,
        state_id: states[Math.floor(index / 2)]._id
      }))
    );

    // Create departments
    const departments = await Department.insertMany(sampleData.departments);

    // Create categories with department references
    const categories = await Category.insertMany(
      sampleData.categories.map((category, index) => ({
        ...category,
        department_id: departments[Math.floor(index / 2)]._id
      }))
    );

    // Create brands
    const brands = await Brand.insertMany(sampleData.brands);

    // Create colors
    const colors = await Color.insertMany(sampleData.colors);

    // Create sizes
    const sizes = await Size.insertMany(sampleData.sizes);

    // Create materials
    const materials = await Material.insertMany(sampleData.materials);

    // Create products with references
    const products = await Product.insertMany(
      sampleData.products.map((product, index) => ({
        ...product,
        category_id: categories[Math.floor(index / 2)]._id,
        brand_id: brands[Math.floor(index / 2)]._id,
        department_id: departments[Math.floor(index / 2)]._id,
        colors: [colors[0]._id, colors[1]._id],
        sizes: [sizes[0]._id, sizes[1]._id],
        materials: [materials[0]._id]
      }))
    );

    // Create coupons
    await Coupon.insertMany(sampleData.coupons);

    // Create users with hashed passwords
    const users = await Promise.all(
      sampleData.users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 