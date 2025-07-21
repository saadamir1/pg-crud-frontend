import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Cities from './pages/Cities';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/cities" 
                element={
                  <PrivateRoute>
                    <Cities />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <PrivateRoute adminOnly={true}>
                    <Users />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;