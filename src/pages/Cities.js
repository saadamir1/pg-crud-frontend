import React, { useState, useEffect } from "react";
import { cityService, uploadService } from "../services/api";

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1,
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    active: true,
  });
  const [editingCity, setEditingCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchCities();
  }, [pagination.page]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await cityService.getAllCities(pagination.page);
      console.log("Cities data:", response.data.data); // Debug log
      setCities(response.data.data);
      setPagination({
        page: response.data.page,
        total: response.data.total,
        lastPage: response.data.lastPage,
      });
    } catch (err) {
      setError("Failed to fetch cities");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", country: "", active: true });
    setEditingCity(null);
    setFormVisible(false);
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      description: city.description || "",
      country: city.country || "",
      active: city.active !== undefined ? city.active : true,
    });
    setFormVisible(true);

    // Scroll to form
    document
      .querySelector(".city-form-container")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action can be undone.`
      )
    ) {
      try {
        await cityService.deleteCity(id);
        setSuccess(`City "${name}" deleted successfully`);
        fetchCities();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to delete city");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.lastPage) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleImageUpload = async (cityId, file) => {
    if (!file) return;

    try {
      setError(null);
      await uploadService.uploadCityImage(cityId, file);
      setSuccess("City image uploaded successfully!");
      fetchCities(); // Refresh to show new image

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    }
  };

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (city.country &&
        city.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="cities-container">
      <div className="card-header">
        <h3>Cities Management</h3>
        <button
          className="btn btn-primary"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? "Hide Form" : "Add New City"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {formVisible && (
        <div
          className="city-form-container"
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              marginBottom: "1.5rem",
              borderBottom: "1px solid #e0e0e0",
              paddingBottom: "1rem",
            }}
          >
            <h3
              style={{
                margin: "0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {editingCity
                ? `✏️ Edit City: ${editingCity.name}`
                : "➕ Add New City"}
            </h3>
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

            <div
              className="form-group"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                style={{ width: "auto", marginRight: "0.5rem" }}
              />
              <label
                htmlFor="active"
                style={{ display: "inline", marginBottom: 0 }}
              >
                Active
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCity ? "Update City" : "Add City"}
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "0.5rem",
                marginRight: "0.5rem",
                width: "200px",
              }}
            />
            <span>{pagination.total} cities total</span>
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : filteredCities.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>No cities found matching your search.</p>
            {searchTerm && (
              <button
                className="btn btn-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className="cities-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="city-card"
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    border: "1px solid #e0e0e0",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  {city.imageUrl && (
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={city.imageUrl}
                        alt={city.name}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.target.parentElement.style.display = "none";
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: city.active ? "#10b981" : "#ef4444",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {city.active ? "Active" : "Inactive"}
                      </div>
                    </div>
                  )}
                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4
                        style={{
                          margin: "0 0 0.5rem 0",
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      >
                        {city.name}
                      </h4>
                      {city.country && (
                        <p
                          style={{
                            margin: "0",
                            fontSize: "14px",
                            color: "#6b7280",
                            fontWeight: "500",
                          }}
                        >
                          📍 {city.country}
                        </p>
                      )}
                    </div>
                    {city.description && (
                      <p
                        style={{
                          margin: "0 0 1rem 0",
                          fontSize: "14px",
                          color: "#4b5563",
                          lineHeight: "1.5",
                        }}
                      >
                        {city.description}
                      </p>
                    )}
                    {!city.imageUrl && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "1rem",
                          padding: "0.5rem",
                          background: city.active ? "#f0fdf4" : "#fef2f2",
                          borderRadius: "6px",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: city.active
                              ? "#10b981"
                              : "#ef4444",
                            marginRight: "0.5rem",
                          }}
                        ></span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: city.active ? "#065f46" : "#991b1b",
                            fontWeight: "500",
                          }}
                        >
                          {city.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(city)}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#f3f4f6",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#374151",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#e5e7eb";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#f3f4f6";
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <label
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#1d4ed8",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "inline-block",
                        }}
                      >
                        📷 Photo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleImageUpload(city.id, e.target.files[0])
                          }
                        />
                      </label>
                      <button
                        onClick={() => handleDelete(city.id, city.name)}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#dc2626",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#fef2f2";
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
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
