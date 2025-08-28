import React, { useState, useEffect } from 'react';
import './EditBrandModal.css';
import axios from 'axios';
import { getApiUrl } from '../utils/api';
/**
 * EditBrandModal component for updating a brand's profile.
 * It fetches states and categories, and dynamically loads cities based on the selected state.
 *
 * @param {object} brand - The brand's current data to populate the form.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onUpdate - Function to call after a successful update.
 */
const EditBrandModal = ({ brand, onClose, onUpdate }) => {
    // Initialize form state with the brand data passed as a prop
    const [form, setForm] = useState({ ...brand });
    
    // State to store dropdown options
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);

    // Fetch initial data for states and categories on component mount
    useEffect(() => {
        // Fetch Indian states
        axios.get(getApiUrl('get-indian-states.php'))
            .then(res => setStates(res.data))
            .catch(err => console.error('Error fetching states:', err));

        // Fetch master categories
        axios.get(getApiUrl('get-categories.php'))
            .then(res => setCategories(res.data))
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    // Fetch cities whenever the state_id in the form changes
    useEffect(() => {
        if (form.state_id) {
            axios.get(getApiUrl(`get-cities.php?state_id=${form.state_id}`))
                .then(res => setCities(res.data))
                .catch(err => console.error('Error fetching cities:', err));
        } else {
            // Clear cities if no state is selected
            setCities([]);
        }
    }, [form.state_id]);

    // Handle changes to form inputs and select elements
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            // Post the updated form data to the PHP API
            const res = await axios.post(getApiUrl('update-brand.php'), form);
            
            // Check if the update was successful
            if (res.data.success) {
                onUpdate(form); // Call the onUpdate callback with the new data
                onClose();     // Close the modal
            } else {
                console.error('Update failed:', res.data.message);
            }
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h3>Edit Brand Profile</h3>
                <div className="modal-body">
                    <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Brand Name" />
                    <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" />
                    <input name="established_year" value={form.established_year || ''} onChange={handleChange} placeholder="Established Year" />
                    <input name="website" value={form.website || ''} onChange={handleChange} placeholder="Website" />
                    
                    {/* Select dropdown for states */}
                    <select name="state_id" value={form.state_id || ''} onChange={handleChange}>
                        <option value="">Select State</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    {/* Select dropdown for cities */}
                    <select name="city_id" value={form.city_id || ''} onChange={handleChange}>
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
                    </select>

                    {/* Select dropdown for categories */}
                    <select name="mas_cat_id" value={form.mas_cat_id || ''} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="modal-footer">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};
export default EditBrandModal;
