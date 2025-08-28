import React, { useEffect, useState } from 'react';
import './BrandList.css';
import { getApiUrl } from '../utils/api';
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaIndustry, FaClock, FaPlus, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';
import { MdComputer, MdLocationCity, MdWifi } from 'react-icons/md';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';

const modeIcons = {
  online: <MdComputer className="icon" />,
  offline: <MdLocationCity className="icon" />,
  hybrid: <MdWifi className="icon" />,
};

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State for adding new brand
  const [form, setForm] = useState({
    name: '',
    state_id: '',
    city_id: '',
    mas_cat_id: '',
    mobile: '',
    email: '',
    password: ''
  });

  // States for editing existing brand
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editableStatus, setEditableStatus] = useState('');
  const [editableMode, setEditableMode] = useState('');

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [masterCategories, setMasterCategories] = useState([]);

  useEffect(() => {
    fetchBrands();
    fetchStates();
    fetchMasterCategories();
  }, []);
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('get-register-brands.php'));
      const result = await res.json();
      if (result.success) {
        setBrands(result.data);
      } else {
        setError(result.message || 'Failed to load brands');
      }
    } catch (e) {
      setError('Network error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await fetch(getApiUrl('get-indian-states.php'));
      const data = await res.json();
      if (Array.isArray(data)) setStates(data);
    } catch (e) {
      console.error('Failed to fetch states:', e);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await fetch(getApiUrl(`get-cities.php?state_id=${stateId}`));
      const data = await res.json();
      if (Array.isArray(data)) setCities(data);
    } catch (e) {
      console.error('Failed to fetch cities:', e);
    }
  };

  const fetchMasterCategories = async () => {
    try {
      const res = await fetch(getApiUrl('get-master-category.php'));
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data.filter((cat) => cat.is_deleted === "0");
        setMasterCategories(filtered);
      }
    } catch (e) {
      console.error('Failed to fetch master categories:', e);
    }
  };

  // Handler for adding new brand
  const handleStateChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, state_id: value, city_id: '' });
    if (value) {
      fetchCities(value);
    } else {
      setCities([]);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBrand = async () => {
    const { name, state_id, city_id, mas_cat_id, mobile, email, password } = form;
    if (!name || !state_id || !city_id || !mas_cat_id || !mobile || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    try {
      const res = await fetch(getApiUrl('add-brand.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          user_name: form.user_name,
          mobile: form.mobile,
          email: form.email,
          password: form.password,
          state_id: form.state_id,
          city_id: form.city_id,
          mas_cat_id: form.mas_cat_id
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Brand added successfully');
        setShowModal(false);
        fetchBrands(); // Refresh the list
        setForm({ // Reset form
          name: '',
          state_id: '',
          city_id: '',
          mas_cat_id: '',
          mobile: '',
          email: '',
          password: ''
        });
        setCities([]);
      } else {
        toast.error(result.message || 'Failed to add brand');
      }
    } catch (err) {
      toast.error('API error: ' + err.message);
    }
  };

  // Handlers for updating existing brand
  const handleEditClick = (brand) => {
    setEditingBrandId(brand.id);
    setEditableStatus(brand.status);
    setEditableMode(brand.mode);
  };

  const handleCancelEdit = () => {
    setEditingBrandId(null);
    setEditableStatus('');
    setEditableMode('');
  };

  const handleSaveClick = async (brandId) => {
    try {
      const res = await fetch(getApiUrl('update-brand-status-mode.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: brandId,
          status: editableStatus,
          mode: editableMode,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Brand updated successfully');
        fetchBrands(); // Refresh the list to show updated data
        handleCancelEdit(); // Exit edit mode
      } else {
        toast.error(result.message || 'Failed to update brand');
      }
    } catch (err) {
      toast.error('API error: ' + err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h2 className="brand-title">Registered Brands</h2>

        <button className="add-brand-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Brand
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal improved-modal">
              <h3 className="modal-title">Add New Brand</h3>

              {[
                { label: 'Brand Name', name: 'name', type: 'text', placeholder: 'Enter brand name' },
                  { label: 'User Name', name: 'user_name', type: 'text', placeholder: 'Enter user name' },
                { label: 'Mobile', name: 'mobile', type: 'text', placeholder: 'Enter mobile number' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter email address' },
                { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter password' }
              ].map((input) => (
                <div className="form-group" key={input.name}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    value={form[input.name]}
                    onChange={handleFormChange}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

              <div className="form-group">
                <label>State</label>
                <select name="state_id" value={form.state_id} onChange={handleStateChange}>
                  <option value="">-- Select State --</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select name="city_id" value={form.city_id} onChange={handleFormChange}>
                  <option value="">-- Select City --</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Master Category</label>
                <select name="mas_cat_id" value={form.mas_cat_id} onChange={handleFormChange}>
                  <option value="">-- Select Master Category --</option>
                  {masterCategories.map((cat) => (
                    <option key={cat.mas_cat_id} value={cat.mas_cat_id}>{cat.mas_cat_name}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddBrand}>Save</button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="status-msg">Loading...</div>
        ) : error ? (
          <div className="status-msg error">{error}</div>
        ) : brands.length === 0 ? (
          <div className="status-msg">No brands found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="brand-table">
              <thead>
                <tr>
                  <th>Brand Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Sector</th>
                  <th>Status</th>
                  <th>Mode</th>
                  <th>Registered At</th>
                  <th>Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id}>
                    <td>{brand.name}</td>
                    <td><FaPhone className="icon" /> {brand.mobile}</td>
                    <td><FaEnvelope className="icon" /> {brand.email}</td>
                    <td><FaMapMarkerAlt className="icon" /> {brand.city_name}, {brand.state_name}</td>
                    <td><FaIndustry className="icon" /> {brand.sector_name || 'N/A'}</td>
                    <td>
                      {editingBrandId === brand.id ? (
                        <select
                          value={editableStatus}
                          onChange={(e) => setEditableStatus(e.target.value)}
                          className="status-select"
                        >
                          <option value="active">active</option>
                          <option value="not active">not active</option>
                        </select>
                      ) : (
                        <span className={`status ${brand.status === 'active' ? 'active' : 'not active'}`}>
                          {brand.status}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingBrandId === brand.id ? (
                        <select
                          value={editableMode}
                          onChange={(e) => setEditableMode(e.target.value)}
                          className="mode-select"
                        >
                          <option value="online">online</option>
                          <option value="offline">offline</option>
                          <option value="hybrid">hybrid</option>
                        </select>
                      ) : (
                        <>
                          {modeIcons[brand.mode] || '—'} {brand.mode}
                        </>
                      )}
                    </td>
                    <td><FaClock className="icon" /> {brand.register_at}</td>
                    <td>
                      {editingBrandId === brand.id ? (
                        <>
                          <button
                            className="action-btn save-btn"
                            onClick={() => handleSaveClick(brand.id)}
                            title="Save Changes"
                          >
                            <FaSave />
                          </button>
                          <button
                            className="action-btn cancel-btn"
                            onClick={handleCancelEdit}
                            title="Cancel Edit"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditClick(brand)}
                          title="Edit Brand"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
