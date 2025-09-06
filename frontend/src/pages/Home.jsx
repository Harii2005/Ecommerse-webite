import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import itemsService from "../services/itemsService";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories] = useState([
    "electronics",
    "clothing",
    "books",
    "home",
    "sports",
    "beauty",
    "toys",
    "food",
  ]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await itemsService.getItems({
        limit: 8,
        sortBy: "rating",
        sortOrder: "desc",
      });

      if (response.success) {
        setProducts(response.data.items);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchFeaturedProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to EcomStore</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <a href="/products" className="cta-button">
            Shop Now
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <a
                key={category}
                href={`/products?category=${category}`}
                className="category-card"
              >
                <div className="category-icon">{getCategoryIcon(category)}</div>
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="view-all-container">
            <a href="/products" className="view-all-button">
              View All Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (category) => {
  const icons = {
    electronics: "📱",
    clothing: "👕",
    books: "📚",
    home: "🏠",
    sports: "⚽",
    beauty: "💄",
    toys: "🧸",
    food: "🍕",
  };
  return icons[category] || "🛍️";
};

export default Home;
