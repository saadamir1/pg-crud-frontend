import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>NestJS PostgreSQL CRUD API</h1>
        <p>A full-featured REST API with JWT authentication, refresh tokens, and RBAC</p>
        
        {!currentUser ? (
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        ) : (
          <div className="welcome-section">
            <h2>Welcome, {currentUser.firstName}!</h2>
            <p>You are logged in as: {currentUser.role}</p>
            
            <div className="feature-cards">
              <div className="feature-card">
                <h3>Cities Management</h3>
                <p>Create, view, update, and delete cities</p>
                <Link to="/cities" className="btn btn-secondary">
                  Manage Cities
                </Link>
              </div>
              
              {isAdmin && (
                <div className="feature-card">
                  <h3>User Management</h3>
                  <p>View and manage users (Admin only)</p>
                  <Link to="/users" className="btn btn-secondary">
                    Manage Users
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>🔐 JWT Authentication</h3>
            <p>Secure access and refresh tokens</p>
          </div>
          <div className="feature">
            <h3>🛡️ Role-Based Access</h3>
            <p>Admin and User role separation</p>
          </div>
          <div className="feature">
            <h3>📋 Pagination</h3>
            <p>Efficient data loading with pagination</p>
          </div>
          <div className="feature">
            <h3>🧹 Soft Delete</h3>
            <p>Safe deletion with recovery option</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;