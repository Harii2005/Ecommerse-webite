import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <h1>EcomStore</h1>
        </Link>

        {/* Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/products" className="nav-link">
            Products
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                Cart ({getCartItemCount()})
              </Link>
              <div className="user-menu">
                <span className="user-greeting">Hello, {user?.name}</span>
                {user?.role === "admin" && (
                  <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
