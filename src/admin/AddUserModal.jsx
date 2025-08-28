import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getApiUrl } from '../utils/api';
import './AddUserModal.css';

export default function AddUserModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        status: 'active',
        permissions: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const availablePermissions = [
        'view_dashboard',
        'view_users', 'add_users', 'edit_users',
        'view_brands', 'add_brands', 'edit_brands',
        'view_investors', 'add_investors', 'view_leads',
        'view_marketing_inquiries', 'view_buy_business_inquiries',
        'view_brand_inquiries', 'view_brand_dashboard', 'view_brand_profile', 'upload_brand_docs',
        'view_sell_business_inquiries',
        'view_lease_properties',
        'view_partner_inquiries',
        'view_newsletter',
        "view_faq",,
        "view_events"
        // New permission added for partner inquiries
        // Added the new permission from the previous context
    ];

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                email: '',
                password: '',
                status: 'active',
                permissions: [],
            });
            setShowPassword(false); // Reset password visibility when the modal opens
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentPermissions = prev.permissions;
            if (checked) {
                return { ...prev, permissions: [...currentPermissions, value] };
            } else {
                return { ...prev, permissions: currentPermissions.filter(p => p !== value) };
            }
        });
    };

    // New function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSaveClick = async () => {
        const { name, email, password, status, permissions } = formData;
        if (!name || !email || !password || !status) {
            toast.error('All fields (except permissions) are required.');
            return;
        }

        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        const dataToSend = {
            name,
            email,
            password,
            status,
            permissions,
        };

        try {
            const response = await fetch(getApiUrl('add-user.php'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const responseText = await response.text();
            const result = JSON.parse(responseText);

            if (result.success) {
                toast.success(result.message);
                onSave();
                onClose();
            } else {
                toast.error(result.message || 'Failed to add user.');
            }
        } catch (e) {
            toast.error('API error adding user: ' + e.message);
            console.error('AddUserModal: Error during API call:', e);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="add-user-modal">
                <div className="modal-header">
                    <h3>Add New User</h3>
                    <button className="close-btn" onClick={onClose} disabled={isSubmitting}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter user's name"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter user's email"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group password-group"> {/* Added a wrapper for the password field */}
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                                disabled={isSubmitting}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="active">Active</option>
                            <option value="not active">Not Active</option>
                        </select>
                    </div>
                    <div className="form-group permissions-group">
                        <label>Permissions</label>
                        <div className="permissions-grid">
                            {availablePermissions.map(permission => (
                                <div key={permission} className="permission-item">
                                    <input
                                        type="checkbox"
                                        id={`perm-${permission}`}
                                        name="permissions"
                                        value={permission}
                                        checked={formData.permissions.includes(permission)}
                                        onChange={handlePermissionChange}
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor={`perm-${permission}`}>{permission.replace(/_/g, ' ')}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="save-btn" onClick={handleSaveClick} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save User'}
                    </button>
                    <button className="cancel-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
