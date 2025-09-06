import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { itemsService } from "../services/itemsService";
import ProductCard from "../components/ProductCard";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [searchQuery, currentPage]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        search: searchQuery,
        page: currentPage,
        limit: 12,
      });

      const response = await itemsService.getAllItems(queryParams.toString());

      if (response.success) {
        setProducts(response.data.items);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message || "Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (!searchQuery) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="no-search">
            <h1>Search Products</h1>
            <p>Enter a search term to find products.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for "{searchQuery}"...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
            <button onClick={fetchSearchResults} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Search Results</h1>
          <p>
            {pagination.totalItems > 0
              ? `Found ${pagination.totalItems} result${
                  pagination.totalItems === 1 ? "" : "s"
                } for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="search-results">
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <div className="pagination-info">
                  Page {currentPage} of {pagination.totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No products found</h3>
            <p>
              Try searching with different keywords or browse our categories.
            </p>
            <div className="search-suggestions">
              <h4>Search suggestions:</h4>
              <ul>
                <li>Check your spelling</li>
                <li>Try more general keywords</li>
                <li>Use fewer keywords</li>
                <li>Browse by category instead</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
