import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { itemsService } from "../services/itemsService";
import "./Admin.css";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "electronics",
    stock: "",
    imageUrl: "",
    rating: "4.0",
    numReviews: "0",
  });
  const navigate = useNavigate();

  const categories = ["electronics", "clothing", "books", "home", "sports"];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user && user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await itemsService.getAllItems("limit=50");

      if (response.success) {
        setProducts(response.data.items);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        numReviews: parseInt(formData.numReviews),
      };

      const response = await itemsService.createItem(productData);

      if (response.success) {
        alert("Product added successfully!");
        setShowAddForm(false);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "electronics",
          stock: "",
          imageUrl: "",
          rating: "4.0",
          numReviews: "0",
        });
        fetchProducts();
      }
    } catch (err) {
      setError(err.message || "Failed to add product");
      alert("Failed to add product: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await itemsService.deleteItem(productId);

      if (response.success) {
        alert("Product deleted successfully!");
        fetchProducts();
      }
    } catch (err) {
      setError(err.message || "Failed to delete product");
      alert("Failed to delete product: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="auth-required">
            <h2>Login Required</h2>
            <p>Please login to access the admin panel</p>
            <button onClick={() => navigate("/login")} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need admin privileges to access this page</p>
            <button onClick={() => navigate("/")} className="home-btn">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage your ecommerce store</p>
        </div>

        <div className="admin-actions">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-product-btn"
            disabled={loading}
          >
            {showAddForm ? "Cancel" : "Add New Product"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showAddForm && (
          <div className="add-product-form">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="5"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numReviews">Number of Reviews</label>
                  <input
                    type="number"
                    id="numReviews"
                    name="numReviews"
                    value={formData.numReviews}
                    onChange={handleInputChange}
                    min="0"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Adding..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-section">
          <h2>Manage Products ({products.length})</h2>

          {loading && !showAddForm ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="products-table">
              <div className="table-header">
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Rating</span>
                <span>Actions</span>
              </div>
              {products.map((product) => (
                <div key={product._id} className="table-row">
                  <div className="product-info">
                    <img
                      src={product.imageUrl || "/api/placeholder/50/50"}
                      alt={product.name}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/50/50";
                      }}
                    />
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.description?.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <span className="category-badge">
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </span>
                  <span className="price">{formatPrice(product.price)}</span>
                  <span
                    className={`stock ${
                      product.stock === 0 ? "out-of-stock" : ""
                    }`}
                  >
                    {product.stock}
                  </span>
                  <span className="rating">
                    ⭐ {product.rating.toFixed(1)} ({product.numReviews})
                  </span>
                  <div className="actions">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="delete-btn"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found. Add some products to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
