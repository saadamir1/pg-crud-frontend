import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cityService, userService } from '../services/api';
import api from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    cities: 0,
    users: 0,
  });
  const [apiStatus, setApiStatus] = useState({
    status: 'checking',
    message: 'Checking...',
    color: '#f39c12'
  });
  const [loading, setLoading] = useState(true);
  
  // Check API health status
  const checkApiStatus = async () => {
    try {
      const response = await api.get('/');
      setApiStatus({
        status: 'online',
        message: 'Online',
        color: '#2ecc71'
      });
    } catch (error) {
      setApiStatus({
        status: 'offline',
        message: 'Offline',
        color: '#e74c3c'
      });
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          setLoading(true);
          
          // Check API status
          await checkApiStatus();
          
          const citiesResponse = await cityService.getAllCities(1, 1);
          
          let usersCount = 0;
          if (user.role === 'admin') {
            const usersResponse = await userService.getAllUsers();
            usersCount = usersResponse.data.length || 0;
          }
          
          setStats({
            cities: citiesResponse.data.total || 0,
            users: usersCount,
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
          // If stats fetch fails, still check API status
          await checkApiStatus();
        } finally {
          setLoading(false);
        }
      } else {
        // Check API status even when not logged in
        await checkApiStatus();
      }
    };
    
    fetchStats();
    
    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  // Format date for activity items
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Mock activity data (in a real app, this would come from the API)
  const activityItems = [
    {
      id: 1,
      title: 'New city added',
      description: 'Paris was added to the database',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: 2,
      title: 'City updated',
      description: 'New York description was updated',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: 3,
      title: 'User logged in',
      description: 'Admin user logged in',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
  ];

  return (
    <>
      {!user ? (
        <div className="auth-container">
          <div className="auth-card">
            <h2>Welcome to NestJS CRUD</h2>
            <p className="text-center">Please log in to access the dashboard</p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="home-container">
          <h2>Dashboard</h2>
          <p>Welcome back, {user.firstName}! Here's an overview of your data.</p>
          
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <div className="dashboard">
                <div className="stat-card">
                  <h3>Total Cities</h3>
                  <div className="stat-value">{stats.cities}</div>
                  <div className="stat-change positive">+2 this week</div>
                </div>
                
                {user.role === 'admin' && (
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <div className="stat-value">{stats.users}</div>
                    <div className="stat-change positive">+1 this week</div>
                  </div>
                )}
                
                <div className="stat-card">
                  <h3>API Status</h3>
                  <div className="stat-value" style={{ color: apiStatus.color, fontSize: '1.5rem' }}>
                    {apiStatus.message}
                  </div>
                  <div className="stat-change">
                    {apiStatus.status === 'online' ? '✓ Connected' : '✗ Disconnected'}
                  </div>
                </div>
              </div>
              
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              
              <div className="dashboard">
                <div className="card">
                  <h4>Cities Management</h4>
                  <p>Create, view, update, and delete cities in the database.</p>
                  <Link to="/cities" className="btn btn-primary">
                    Manage Cities
                  </Link>
                </div>
                
                {user.role === 'admin' && (
                  <div className="card">
                    <h4>User Management</h4>
                    <p>View and manage users with different access levels.</p>
                    <Link to="/users" className="btn btn-primary">
                      Manage Users
                    </Link>
                  </div>
                )}
                
                <div className="card">
                  <h4>API Documentation</h4>
                  <p>View the API documentation and endpoints.</p>
                  <a 
                    href="https://github.com/saadamir1/nestjs-pg-crud" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    View Docs
                  </a>
                </div>
              </div>
              
              <div className="card-header">
                <h3>Recent Activity</h3>
              </div>
              
              <div className="recent-activity">
                {activityItems.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div className="activity-header">
                      <span className="activity-title">{item.title}</span>
                      <span className="activity-date">{formatDate(item.date)}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Home;