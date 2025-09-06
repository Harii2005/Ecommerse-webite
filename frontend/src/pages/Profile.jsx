import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import "./Profile.css";

const Profile = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setUserProfile(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }

    fetchProfile();
  }, [isAuthenticated, user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.getProfile();

      if (response.success) {
        setUserProfile(response.data.user);
        setFormData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Note: This would require implementing an update profile endpoint
      // For now, we'll just show a message
      alert("Profile update functionality would be implemented here");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="auth-required">
            <h2>Login Required</h2>
            <p>Please login to view your profile</p>
            <button onClick={() => navigate("/login")} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !userProfile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
            <button onClick={fetchProfile} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {userProfile?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div className="profile-title">
            <h1>My Profile</h1>
            <p>Manage your account information</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h2>Account Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="edit-btn"
                disabled={loading}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
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
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="cancel-btn"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <label>Full Name</label>
                  <p>{userProfile?.name || "Not provided"}</p>
                </div>

                <div className="info-group">
                  <label>Email Address</label>
                  <p>{userProfile?.email || "Not provided"}</p>
                </div>

                <div className="info-group">
                  <label>Account Type</label>
                  <p>
                    <span className={`role-badge ${userProfile?.role}`}>
                      {userProfile?.role?.toUpperCase() || "USER"}
                    </span>
                  </p>
                </div>

                <div className="info-group">
                  <label>Member Since</label>
                  <p>
                    {userProfile?.createdAt
                      ? formatDate(userProfile.createdAt)
                      : "Unknown"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <div className="action-card">
              <h3>Quick Actions</h3>

              <div className="action-list">
                <button
                  onClick={() => navigate("/cart")}
                  className="action-btn"
                >
                  <span className="action-icon">🛒</span>
                  <div>
                    <strong>View Cart</strong>
                    <p>Check your shopping cart</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="action-btn"
                >
                  <span className="action-icon">🛍️</span>
                  <div>
                    <strong>Browse Products</strong>
                    <p>Explore our product catalog</p>
                  </div>
                </button>

                {userProfile?.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="action-btn admin-action"
                  >
                    <span className="action-icon">⚙️</span>
                    <div>
                      <strong>Admin Panel</strong>
                      <p>Manage the store</p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="danger-zone">
              <h3>Account Actions</h3>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
