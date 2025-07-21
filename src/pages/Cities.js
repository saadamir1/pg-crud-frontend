import React, { useState, useEffect } from 'react';
import { cityService } from '../services/api';

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
  });
  const [editingCity, setEditingCity] = useState(null);

  useEffect(() => {
    fetchCities();
  }, [pagination.page]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await cityService.getAllCities(pagination.page);
      setCities(response.data.data);
      setPagination({
        page: response.data.page,
        total: response.data.total,
        lastPage: response.data.lastPage,
      });
    } catch (err) {
      setError('Failed to fetch cities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCity) {
        await cityService.updateCity(editingCity.id, formData);
      } else {
        await cityService.createCity(formData);
      }
      
      setFormData({ name: '', description: '', country: '' });
      setEditingCity(null);
      fetchCities();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      description: city.description || '',
      country: city.country || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        await cityService.deleteCity(id);
        fetchCities();
      } catch (err) {
        setError('Failed to delete city');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.lastPage) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="cities-container">
      <h2>Cities Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="city-form-container">
        <h3>{editingCity ? 'Edit City' : 'Add New City'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingCity ? 'Update City' : 'Add City'}
            </button>
            
            {editingCity && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingCity(null);
                  setFormData({ name: '', description: '', country: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="cities-list">
        <h3>Cities List</h3>
        
        {loading ? (
          <p>Loading cities...</p>
        ) : cities.length === 0 ? (
          <p>No cities found.</p>
        ) : (
          <>
            <div className="cities-grid">
              {cities.map((city) => (
                <div key={city.id} className="city-card">
                  <h4>{city.name}</h4>
                  <p>{city.description}</p>
                  {city.country && <p><strong>Country:</strong> {city.country}</p>}
                  <div className="city-actions">
                    <button
                      onClick={() => handleEdit(city)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(city.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-sm"
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.lastPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.lastPage}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cities;