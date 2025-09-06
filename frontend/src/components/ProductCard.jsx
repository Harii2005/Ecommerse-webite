import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await addToCart(product._id, 1);
      alert("Item added to cart successfully!");
    } catch (error) {
      alert(error.message || "Failed to add item to cart");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>

          <div className="product-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-text">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>

          <div className="product-footer">
            <span className="product-price">{formatPrice(product.price)}</span>
            <span
              className={`stock-status ${
                product.stock > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        </div>
      </Link>

      <div className="product-actions">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading}
          className={`add-to-cart-btn ${product.stock === 0 ? "disabled" : ""}`}
        >
          {loading
            ? "Adding..."
            : product.stock === 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
