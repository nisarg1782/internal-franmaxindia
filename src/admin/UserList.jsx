import React, { useEffect, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaUserCircle, FaEnvelope, FaLock, FaCheckCircle, FaTimesCircle, 
  FaSignInAlt, FaPlus, FaEdit, FaSave, FaTimes // Added edit, save, cancel icons
} from 'react-icons/fa';

import { getApiUrl } from '../utils/api'; 
import Sidebar from './Sidebar'; 
import AddUserModal from './AddUserModal'; 

import './UserList.css'; 

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // State for the new user form (for AddUserModal)
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active', // Default status
  });

  // States for editing an existing user
  const [editingUserId, setEditingUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState('');
  const [editableUserEmail, setEditableUserEmail] = useState('');
  const [editableUserStatus, setEditableUserStatus] = useState('');

  // Function to fetch users from the API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('get-users.php')); 
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
        toast.success('Users loaded successfully!');
      } else {
        toast.error(result.message || 'Failed to fetch users.');
        setError(result.message || 'Failed to fetch users.');
      }
    } catch (e) {
      toast.error('Network error or API issue: ' + e.message);
      setError('Network error or API issue: ' + e.message);
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(); 
  }, [fetchUsers]);

  // Handler for new user form changes (for AddUserModal)
  const handleNewUserFormChange = (e) => {
    setNewUserForm({ ...newUserForm, [e.target.name]: e.target.value });
  };

  // Handler for adding a new user (called by AddUserModal)
  const handleAddUserSubmit = async () => {
    const { name, email, password, status } = newUserForm;
    if (!name || !email || !password || !status) {
      toast.error('All fields are required.');
      return;
    }

    try {
      const response = await fetch(getApiUrl('add-user.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserForm),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setShowAddUserModal(false); // Close modal
        setNewUserForm({ // Reset form
          name: '',
          email: '',
          password: '',
          status: 'active',
        });
        fetchUsers(); // Refresh user list
      } else {
        toast.error(result.message || 'Failed to add user.');
      }
    } catch (e) {
      toast.error('API error adding user: ' + e.message);
      console.error('Error adding user:', e);
    }
  };

  // Handlers for editing existing users
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditableUserName(user.name);
    setEditableUserEmail(user.email);
    setEditableUserStatus(user.status);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null); // Exit edit mode
    setEditableUserName('');
    setEditableUserEmail('');
    setEditableUserStatus('');
  };

  const handleSaveUser = async (userId) => {
    // Basic validation for editable fields
    if (!editableUserName || !editableUserEmail || !editableUserStatus) {
      toast.error('Name, Email, and Status cannot be empty.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableUserEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(getApiUrl('update-user.php'), { // Call the new update API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          name: editableUserName,
          email: editableUserEmail,
          status: editableUserStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUsers(); // Refresh the list to show updated data
        handleCancelEdit(); // Exit edit mode
      } else {
        toast.error(result.message || 'Failed to update user.');
      }
    } catch (e) {
      toast.error('API error updating user: ' + e.message);
      console.error('Error updating user:', e);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content user-list-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        <div className="user-list-header">
          <h2 className="user-list-title">User List</h2>
          <button className="add-user-btn" onClick={() => setShowAddUserModal(true)}>
            <FaPlus /> Add User
          </button>
        </div>

        {loading ? (
          <div className="status-message loading-message">Loading users...</div>
        ) : error ? (
          <div className="status-message error-message">Error: {error}</div>
        ) : users.length === 0 ? (
          <div className="status-message no-data-message">No users found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th><FaEnvelope className="table-icon" /> Email</th>
                  <th><FaUserCircle className="table-icon" /> Name</th>
                  <th><FaLock className="table-icon" /> Password</th>
                  <th><FaCheckCircle className="table-icon" /> Status</th>
                  <th><FaSignInAlt className="table-icon" /> Created At</th>
                  <th>Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <input 
                          type="email" 
                          value={editableUserEmail} 
                          onChange={(e) => setEditableUserEmail(e.target.value)} 
                          className="editable-input"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <input 
                          type="text" 
                          value={editableUserName} 
                          onChange={(e) => setEditableUserName(e.target.value)} 
                          className="editable-input"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>********</td> {/* Password is not editable */}
                    <td>
                      {editingUserId === user.id ? (
                        <select 
                          value={editableUserStatus} 
                          onChange={(e) => setEditableUserStatus(e.target.value)}
                          className="editable-select"
                        >
                          <option value="active">Active</option>
                          <option value="not active">Not Active</option>
                        </select>
                      ) : (
                        <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td>{user.created_at || 'N/A'}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <>
                          <button 
                            className="action-btn save-btn" 
                            onClick={() => handleSaveUser(user.id)}
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
                          onClick={() => handleEditClick(user)}
                          title="Edit User"
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

        {showAddUserModal && (
          <AddUserModal
            isOpen={showAddUserModal}
            onClose={() => setShowAddUserModal(false)}
            onSave={handleAddUserSubmit}
            form={newUserForm}
            handleFormChange={handleNewUserFormChange}
          />
        )}
      </div>
    </div>
  );
}
