import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { itemsService } from "../services/itemsService";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "name",
    sortOrder: searchParams.get("sortOrder") || "asc",
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 12,
  });

  const categories = [
    "electronics",
    "clothing",
    "books",
    "home",
    "sports",
    "beauty",
    "toys",
    "food",
  ];

  useEffect(() => {
    // Update filters when searchParams change
    setFilters({
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: searchParams.get("sortOrder") || "asc",
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 12,
    });
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]); // Changed dependency to searchParams instead of filters

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current filters from URL parameters
      const currentFilters = {
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        search: searchParams.get("search") || "",
        sortBy: searchParams.get("sortBy") || "name",
        sortOrder: searchParams.get("sortOrder") || "asc",
        page: parseInt(searchParams.get("page")) || 1,
        limit: parseInt(searchParams.get("limit")) || 12,
      };

      const queryParams = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await itemsService.getAllItems(queryParams.toString());

      if (response.success) {
        setProducts(response.data.items);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);

    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "") newSearchParams.append(k, v);
    });

    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage) => {
    handleFilterChange("page", newPage);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
      sortBy: "name",
      sortOrder: "asc",
      page: 1,
      limit: 12,
    });
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>All Products</h1>
          <p>Discover our amazing collection</p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h3>Filter Products</h3>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>

          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                placeholder="$1000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>

            {/* Search */}
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="createdAt">Date Added</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="results-header">
            <p>
              Showing {pagination.totalItems || 0} products
              {filters.category && ` in ${filters.category}`}
            </p>
          </div>

          {products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  <div className="pagination-info">
                    Page {filters.page} of {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= pagination.totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
