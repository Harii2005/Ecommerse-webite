import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const {
    cart,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, navigate]);

  // Debug log to see cart data
  useEffect(() => {
    console.log("Cart Debug - cart:", cart);
    console.log("Cart Debug - loading:", loading);
    console.log("Cart Debug - error:", error);
    console.log("Cart Debug - cart.items:", cart?.items);
  }, [cart, loading, error]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      alert(error.message || "Failed to update cart item");
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        alert(error.message || "Failed to remove item from cart");
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
      } catch (error) {
        alert(error.message || "Failed to clear cart");
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateItemTotal = (price, quantity) => {
    return price * quantity;
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="auth-required">
            <h2>Login Required</h2>
            <p>Please login to view your cart</p>
            <button onClick={() => navigate("/login")} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
            <button onClick={fetchCart} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="shop-now-btn"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <div className="cart-actions">
            <button onClick={handleClearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((cartItem) => (
              <div key={cartItem.item._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={cartItem.item.imageUrl || "/api/placeholder/150/150"}
                    alt={cartItem.item.name}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/150/150";
                    }}
                  />
                </div>

                <div className="item-details">
                  <h3>{cartItem.item.name}</h3>
                  <p className="item-description">
                    {cartItem.item.description}
                  </p>
                  <p className="item-price">{formatPrice(cartItem.price)}</p>
                </div>

                <div className="quantity-controls">
                  <label>Quantity:</label>
                  <div className="quantity-input">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          cartItem.item._id,
                          cartItem.quantity - 1
                        )
                      }
                      disabled={cartItem.quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={cartItem.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (newQuantity > 0) {
                          handleQuantityChange(cartItem.item._id, newQuantity);
                        }
                      }}
                      min="1"
                      className="quantity-value"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          cartItem.item._id,
                          cartItem.quantity + 1
                        )
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <p className="total-label">Total:</p>
                  <p className="total-price">
                    {formatPrice(
                      calculateItemTotal(cartItem.price, cartItem.quantity)
                    )}
                  </p>
                </div>

                <div className="item-actions">
                  <button
                    onClick={() => handleRemoveItem(cartItem.item._id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Items ({cart.items.length}):</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>

              <div className="summary-row">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total:</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>

              <button className="checkout-btn">Proceed to Checkout</button>

              <button
                onClick={() => navigate("/products")}
                className="continue-shopping-btn"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
