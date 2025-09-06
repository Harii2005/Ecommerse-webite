const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!itemId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Please provide itemId and quantity'
            });
        }

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Check if item is in stock
        if (item.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${item.stock} items available in stock`
            });
        }

        // Find or create cart for user
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: userId,
                items: [{
                    item: itemId,
                    quantity,
                    price: item.price
                }]
            });
        } else {
            // Check if item already exists in cart
            const existingItemIndex = cart.items.findIndex(
                cartItem => cartItem.item.toString() === itemId
            );

            if (existingItemIndex >= 0) {
                // Update quantity if item already exists
                cart.items[existingItemIndex].quantity += quantity;
                cart.items[existingItemIndex].price = item.price; // Update price in case it changed
            } else {
                // Add new item to cart
                cart.items.push({
                    item: itemId,
                    quantity,
                    price: item.price
                });
            }
        }

        await cart.save();

        // Populate cart with item details
        await cart.populate('items.item', 'name description imageUrl');

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: { cart }
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error adding item to cart',
            error: error.message
        });
    }
};

// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate('items.item', 'name description imageUrl stock');

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    cart: {
                        items: [],
                        totalAmount: 0
                    }
                }
            });
        }

        res.status(200).json({
            success: true,
            data: { cart }
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting cart',
            error: error.message
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find and remove the item
        const itemIndex = cart.items.findIndex(
            cartItem => cartItem.item.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        // Populate cart with item details
        await cart.populate('items.item', 'name description imageUrl');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart successfully',
            data: { cart }
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error removing item from cart',
            error: error.message
        });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Check if item is in stock
        if (item.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${item.stock} items available in stock`
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find and update the item
        const itemIndex = cart.items.findIndex(
            cartItem => cartItem.item.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = item.price; // Update price in case it changed
        await cart.save();

        // Populate cart with item details
        await cart.populate('items.item', 'name description imageUrl');

        res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            data: { cart }
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating cart item',
            error: error.message
        });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: { cart }
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error clearing cart',
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItem,
    clearCart
};
