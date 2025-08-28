import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getApiUrl } from '../utils/api'; // Ensure this path is correct
import './AssignModal.css'; // Ensure this path is correct

export default function AssignModal({ investor, onClose, onAssign }) {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Fetching brands for the dropdown
        const response = await fetch(getApiUrl('get-brands-name.php')); 
        const result = await response.json();
        if (result.success) {
          setBrands(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch brands for dropdown.');
        }
      } catch (e) {
        toast.error('Network error fetching brands for dropdown.');
        console.error('Error fetching brands:', e);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  const handleAssignClick = async () => {
    if (!selectedBrand) {
      toast.error('Please select a brand to assign.');
      return;
    }

    // Construct the data payload for the API
    const dataToAssign = {
      name: investor.name,
      phone: investor.phone,
      email: investor.email,
      state: investor.state_name, // PHP expects 'state' and 'city' strings
      state_id: investor.state_id,
      city: investor.city_name,
      city_id: investor.city_id,
      message: investor.message,
      brand_id: selectedBrand,
    };

    // --- DEBUGGING START ---
    console.log('Data being sent to PHP:', dataToAssign);
    console.log('JSON stringified data:', JSON.stringify(dataToAssign));
    // --- DEBUGGING END ---
    
    try {
      const response = await fetch(getApiUrl('assign-investor.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Crucial header
        },
        body: JSON.stringify(dataToAssign),
      });

      // --- DEBUGGING START ---
      console.log('Raw response status:', response.status);
      const responseText = await response.text(); // Get raw text first
      console.log('Raw response text:', responseText);
      // --- DEBUGGING END ---

      const result = JSON.parse(responseText); // Manually parse after logging raw text

      if (result.success) {
        toast.success(result.message);
        onAssign(); // Callback to parent to refresh data and close modal
      } else {
        toast.error(result.message || 'Failed to assign investor.');
      }
    } catch (e) {
      toast.error('API error during assignment: ' + e.message);
      console.error('Error during API call:', e);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="assign-modal">
        <div className="modal-header">
          <h3>Assign {investor.name} to Brand</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>
            **Assigning** **`{investor.name}`** **to a brand.**
          </p>
          <div className="form-group">
            <label htmlFor="brand-select">Select Brand:</label>
            {loadingBrands ? (
              <p>Loading brands...</p>
            ) : (
              <select
                id="brand-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">-- Choose a Brand --</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-assign" onClick={handleAssignClick} disabled={!selectedBrand}>
            Assign
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
