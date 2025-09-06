const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

router.post("/", addToCart);
router.get("/", getCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;
