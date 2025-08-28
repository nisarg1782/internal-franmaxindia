import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Used for redirection after login
import { ToastContainer, toast } from 'react-toastify'; // For displaying notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import { getApiUrl } from '../utils/api'; // Utility function to get API endpoint URLs
import './AdminLogin.css'; // Custom CSS for the login page
import logo from '../assets/logo/Franmax_logo.png'; // Path to your company logo

const Login = () => {
  // State to manage form inputs (email and password)
  const [form, setForm] = useState({ email: '', password: '' });
  // State to toggle password visibility in the input field
  const [showPassword, setShowPassword] = useState(false);
  // State to manage loading status during API call, disables button
  const [loading, setLoading] = useState(false);
  // Hook from react-router-dom for programmatic navigation
  const navigate = useNavigate();

  // Handles changes in form input fields
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Toggles the type of the password input field between 'password' and 'text'
  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading to true to disable the button

    try {
      // Make a POST request to the login API endpoint
      // Ensure this points to your PHP login file (e.g., 'login.php' or 'admin-login.php')
      const response = await fetch(getApiUrl('admin-login.php'), { // Changed to 'login.php' for consistency with previous examples
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate that the request body is JSON
        },
        body: JSON.stringify(form), // Convert form data to a JSON string
      });

      // Parse the JSON response from the server
      const result = await response.json();

      // Check if the HTTP response was successful (status 2xx) AND the API logic indicates success
      if (response.ok && result.success) {
        toast.success(result.message); // Show success notification

        // ✅ Store user data in localStorage for session management
        localStorage.setItem('adminId', result.user.id); // Store admin's ID
        localStorage.setItem('adminName', result.user.name); // Store admin's name (assuming PHP returns it)
        localStorage.setItem('adminEmail', form.email); // Store admin's email from the form
        // ✅ NEW: Store permissions as a JSON string in localStorage
        localStorage.setItem('adminPermissions', JSON.stringify(result.user.permissions || [])); 

        navigate('/admin/dashboard'); // Redirect to the admin dashboard page
      } else {
        // Handle API-specific errors (e.g., invalid credentials returned by backend)
        toast.error(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (e) {
      // Catch network errors or issues with the API call itself
      toast.error('Network error. Please try again.');
      console.error('Login API error:', e);
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <div className="snblogin-wrapper">
      {/* ToastContainer for displaying notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="snblogin-card">
        {/* Company Logo */}
        <img src={logo} alt="Franmax Logo" className="snblogin-logo" />
        <h2 className="snblogin-title">Welcome Back</h2>
        <p className="snblogin-subtitle">Login to your account</p>
        <form className="snblogin-form" onSubmit={handleSubmit}>
          {/* Email Input Group */}
          <div className="snblogin-input-group">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required // HTML5 validation: field is required
            />
          </div>
          {/* Password Input Group with Toggle */}
          <div className="snblogin-input-group">
            <div className="snblogin-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'} // Dynamically change input type
                name="password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required // HTML5 validation: field is required
              />
              {/* Password visibility toggle icon */}
              <span
                className="snblogin-toggle"
                onClick={togglePassword}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          {/* Login Button */}
          <button type="submit" className="snblogin-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} {/* Change text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
