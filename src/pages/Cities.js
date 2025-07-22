import React, { useState, useEffect } from 'react';
import { cityService } from '../services/api';

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    active: true,
  });
  const [editingCity, setEditingCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);

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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (editingCity) {
        await cityService.updateCity(editingCity.id, formData);
        setSuccess(`City "${formData.name}" updated successfully`);
      } else {
        await cityService.createCity(formData);
        setSuccess(`City "${formData.name}" created successfully`);
      }
      
      resetForm();
      fetchCities();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', country: '', active: true });
    setEditingCity(null);
    setFormVisible(false);
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      description: city.description || '',
      country: city.country || '',
      active: city.active !== undefined ? city.active : true,
    });
    setFormVisible(true);
    
    // Scroll to form
    document.querySelector('.city-form-container').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action can be undone.`)) {
      try {
        await cityService.deleteCity(id);
        setSuccess(`City "${name}" deleted successfully`);
        fetchCities();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
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
  
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (city.country && city.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="cities-container">
      <div className="card-header">
        <h3>Cities Management</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? 'Hide Form' : 'Add New City'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {formVisible && (
        <div className="city-form-container card">
          <div className="card-header">
            <h3>{editingCity ? `Edit City: ${editingCity.name}` : 'Add New City'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">City Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. New York"
                  required
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
                  placeholder="e.g. United States"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a brief description of the city"
                rows="3"
              />
            </div>
            
            <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                style={{ width: 'auto', marginRight: '0.5rem' }}
              />
              <label htmlFor="active" style={{ display: 'inline', marginBottom: 0 }}>
                Active
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCity ? 'Update City' : 'Add City'}
              </button>
              
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="cities-list card">
        <div className="card-header">
          <h3>Cities Directory</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.5rem', marginRight: '0.5rem', width: '200px' }}
            />
            <span>{pagination.total} cities total</span>
          </div>
        </div>
        
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : filteredCities.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No cities found matching your search.</p>
            {searchTerm && (
              <button 
                className="btn btn-secondary" 
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="cities-grid">
              {filteredCities.map((city) => (
                <div key={city.id} className="city-card">
                  <h4>{city.name}</h4>
                  {city.country && <p><strong>Country:</strong> {city.country}</p>}
                  {city.description && <p>{city.description}</p>}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginTop: '0.5rem',
                    color: city.active ? 'var(--success-color)' : 'var(--danger-color)'
                  }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: city.active ? 'var(--success-color)' : 'var(--danger-color)',
                      display: 'inline-block',
                      marginRight: '0.5rem'
                    }}></span>
                    <span>{city.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="city-actions">
                    <button
                      onClick={() => handleEdit(city)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(city.id, city.name)}
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
                &laquo; Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.lastPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.lastPage}
                className="btn btn-sm"
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cities;