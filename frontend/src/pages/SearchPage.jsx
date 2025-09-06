import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { itemsService } from "../services/itemsService";
import ProductCard from "../components/ProductCard";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const searchQuery = searchParams.get("q");
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 12;

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, page]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        search: searchQuery,
        page: page.toString(),
        limit: limit.toString(),
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
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${newSearchParams}`
    );
    window.location.reload();
  };

  if (!searchQuery) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="no-search">
            <h1>🔍</h1>
            <h1>Search Products</h1>
            <p>Use the search bar above to find products</p>
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
            <button onClick={performSearch} className="retry-button">
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
                  pagination.totalItems !== 1 ? "s" : ""
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
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <div className="pagination-info">
                  Page {page} of {pagination.totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
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
            <p>We couldn't find any products matching "{searchQuery}"</p>

            <div className="search-suggestions">
              <h4>Try these suggestions:</h4>
              <ul>
                <li>Check your spelling</li>
                <li>Use different keywords</li>
                <li>Search for broader terms</li>
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
