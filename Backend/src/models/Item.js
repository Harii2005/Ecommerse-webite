const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide item name"],
    trim: true,
    maxlength: [100, "Item name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide item description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide item price"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Please provide item category"],
    enum: [
      "electronics",
      "clothing",
      "books",
      "home",
      "sports",
      "beauty",
      "toys",
      "food",
    ],
    lowercase: true,
  },
  stock: {
    type: Number,
    required: [true, "Please provide stock quantity"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/300x300",
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, "Number of reviews cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
itemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Item", itemSchema);
