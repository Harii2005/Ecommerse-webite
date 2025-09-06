const Item = require('../models/Item');

// Create new item (Admin only)
const createItem = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl, rating, numReviews } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, description, price, and category'
            });
        }

        const item = await Item.create({
            name,
            description,
            price,
            category,
            stock: stock || 0,
            imageUrl,
            rating: rating || 0,
            numReviews: numReviews || 0
        });

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: { item }
        });
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating item',
            error: error.message
        });
    }
};

// Get all items with filters
const getAllItems = async (req, res) => {
    try {
        let query = {};
        
        // Category filter
        if (req.query.category) {
            query.category = req.query.category.toLowerCase();
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) {
                query.price.$gte = parseFloat(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                query.price.$lte = parseFloat(req.query.maxPrice);
            }
        }

        // Search by name
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sort options
        let sortOptions = {};
        if (req.query.sortBy) {
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
            sortOptions[sortBy] = sortOrder;
        } else {
            sortOptions.createdAt = -1; // Default: newest first
        }

        const items = await Item.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalItems = await Item.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            success: true,
            data: {
                items,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit
                }
            }
        });
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting items',
            error: error.message
        });
    }
};

// Get single item by ID
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { item }
        });
    } catch (error) {
        console.error('Get item by ID error:', error);
        
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error getting item',
            error: error.message
        });
    }
};

// Update item (Admin only)
const updateItem = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl, rating, numReviews } = req.body;

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Update fields if provided
        if (name) item.name = name;
        if (description) item.description = description;
        if (price !== undefined) item.price = price;
        if (category) item.category = category;
        if (stock !== undefined) item.stock = stock;
        if (imageUrl) item.imageUrl = imageUrl;
        if (rating !== undefined) item.rating = rating;
        if (numReviews !== undefined) item.numReviews = numReviews;

        const updatedItem = await item.save();

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: { item: updatedItem }
        });
    } catch (error) {
        console.error('Update item error:', error);
        
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error updating item',
            error: error.message
        });
    }
};

// Delete item (Admin only)
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        await Item.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error('Delete item error:', error);
        
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error deleting item',
            error: error.message
        });
    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};
