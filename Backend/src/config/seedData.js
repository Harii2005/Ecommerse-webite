const mongoose = require('mongoose');
const Item = require('../models/Item');
const User = require('../models/User');

const sampleItems = [
    {
        name: "iPhone 14 Pro",
        description: "Latest Apple iPhone with advanced camera system and A16 Bionic chip",
        price: 999.99,
        category: "electronics",
        stock: 50,
        imageUrl: "https://via.placeholder.com/300x300?text=iPhone+14+Pro",
        rating: 4.8,
        numReviews: 234
    },
    {
        name: "Samsung Galaxy S23",
        description: "Flagship Android smartphone with excellent camera and performance",
        price: 899.99,
        category: "electronics",
        stock: 30,
        imageUrl: "https://via.placeholder.com/300x300?text=Galaxy+S23",
        rating: 4.6,
        numReviews: 156
    },
    {
        name: "Nike Air Max 270",
        description: "Comfortable running shoes with air cushioning technology",
        price: 150.00,
        category: "clothing",
        stock: 100,
        imageUrl: "https://via.placeholder.com/300x300?text=Nike+Air+Max",
        rating: 4.4,
        numReviews: 89
    },
    {
        name: "MacBook Air M2",
        description: "Lightweight laptop with Apple M2 chip and all-day battery life",
        price: 1199.99,
        category: "electronics",
        stock: 25,
        imageUrl: "https://via.placeholder.com/300x300?text=MacBook+Air",
        rating: 4.9,
        numReviews: 312
    },
    {
        name: "Levi's 501 Original Jeans",
        description: "Classic straight-fit jeans made from premium denim",
        price: 89.99,
        category: "clothing",
        stock: 75,
        imageUrl: "https://via.placeholder.com/300x300?text=Levis+Jeans",
        rating: 4.3,
        numReviews: 67
    },
    {
        name: "The Great Gatsby",
        description: "Classic American novel by F. Scott Fitzgerald",
        price: 12.99,
        category: "books",
        stock: 200,
        imageUrl: "https://via.placeholder.com/300x300?text=Great+Gatsby",
        rating: 4.2,
        numReviews: 1456
    },
    {
        name: "KitchenAid Stand Mixer",
        description: "Professional 5-quart stand mixer for all your baking needs",
        price: 349.99,
        category: "home",
        stock: 15,
        imageUrl: "https://via.placeholder.com/300x300?text=Stand+Mixer",
        rating: 4.7,
        numReviews: 203
    },
    {
        name: "Wilson Tennis Racket",
        description: "Professional tennis racket for intermediate to advanced players",
        price: 179.99,
        category: "sports",
        stock: 40,
        imageUrl: "https://via.placeholder.com/300x300?text=Tennis+Racket",
        rating: 4.5,
        numReviews: 78
    },
    {
        name: "L'Oreal Paris Skincare Set",
        description: "Complete skincare routine with cleanser, serum, and moisturizer",
        price: 45.99,
        category: "beauty",
        stock: 120,
        imageUrl: "https://via.placeholder.com/300x300?text=Skincare+Set",
        rating: 4.1,
        numReviews: 234
    },
    {
        name: "LEGO Creator Expert Set",
        description: "Advanced LEGO building set for creative construction",
        price: 129.99,
        category: "toys",
        stock: 60,
        imageUrl: "https://via.placeholder.com/300x300?text=LEGO+Set",
        rating: 4.8,
        numReviews: 145
    },
    {
        name: "Organic Coffee Beans",
        description: "Premium organic coffee beans from South America",
        price: 24.99,
        category: "food",
        stock: 80,
        imageUrl: "https://via.placeholder.com/300x300?text=Coffee+Beans",
        rating: 4.6,
        numReviews: 92
    },
    {
        name: "Bluetooth Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        category: "electronics",
        stock: 45,
        imageUrl: "https://via.placeholder.com/300x300?text=Headphones",
        rating: 4.4,
        numReviews: 167
    }
];

const sampleUsers = [
    {
        name: "Admin User",
        email: "admin@ecommerce.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "John Doe",
        email: "john@example.com",
        password: "user123",
        role: "user"
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "user123",
        role: "user"
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Item.deleteMany({});
        await User.deleteMany({});

        // Insert sample users
        console.log('👥 Creating sample users...');
        const createdUsers = await User.create(sampleUsers);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Insert sample items
        console.log('📦 Creating sample items...');
        const createdItems = await Item.create(sampleItems);
        console.log(`✅ Created ${createdItems.length} items`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\nSample Users:');
        console.log('Admin: admin@ecommerce.com / admin123');
        console.log('User 1: john@example.com / user123');
        console.log('User 2: jane@example.com / user123');

        return {
            users: createdUsers,
            items: createdItems
        };
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

module.exports = { seedDatabase, sampleItems, sampleUsers };
