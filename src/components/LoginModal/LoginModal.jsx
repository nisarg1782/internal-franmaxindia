import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validateLogin from '../../utils/validateLogin';
import '../design/LoginModal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../../utils/api';

export default function LoginModal({ isOpen, onClose, openRegister }) {
    // Renamed the state variable from 'email' to 'username' for clarity
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Updated the validation function call to use 'username'
        const validationErrors = validateLogin({ username, password });

        if (Object.keys(validationErrors).length > 0) {
            Object.values(validationErrors).forEach(err => toast.error(err));
            return;
        }

        try {
            // Updated the payload to correctly send the 'username'
            const payload = { user_name: username, password };
            
            const res = await fetch(getApiUrl('validate-login.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                toast.success(`✅ Login successful! Welcome, ${data.user.name}.`);
                
                // Store session data with a specific key based on user type
                if (data.user.user_type === 'investor') {
                    localStorage.setItem('investor_session', JSON.stringify(data.user));
                    navigate('/investor-dashboard');
                } else if (data.user.user_type === 'brand') {
                    localStorage.setItem('userSession', JSON.stringify(data.user));
                    navigate('/brand/dashboard');
                } else {
                    localStorage.setItem('userSession', JSON.stringify(data.user));
                    onClose();
                }

            } else {
                toast.error(`❌ ${data.message}`);
            }
        } catch (err) {
            toast.error('🚫 Error connecting to the server. Please check your network and server status.');
            console.error(err);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="login-modal-overlay">
                <div className="login-modal-box">
                    <button className="close-modal-btn" onClick={onClose}>✖</button>
                    <h2 className="login-title">Login</h2>
                    <div className="login-form">
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <span className="icon">👤</span>
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    // Binds the input value to the new 'username' state
                                    value={username}
                                    // Updates the 'username' state on change
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="input-group password-group">
                                <span className="icon">🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? 'Hide Password' : 'Show Password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </span>
                            </div>
                            <div className="submit-row">
                                <button type="submit" className="submit-btn">SIGN IN</button>
                                <a href="#" className="forgot-link">Forgot Password?</a>
                            </div>
                        </form>
                        <div className="social-login">
                            <p className="or-text">or Sign in With</p>
                            <button className="google-btn">G</button>
                            <p className="register-text">
                                New User?{' '}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onClose();
                                        openRegister();
                                    }}
                                >
                                    Click here to Register
                                </a>
                            </p>
                        </div>
                        <div className="why-register">
                            <h4>Why should I register?</h4>
                            <p>
                                Gain access to <strong>2,000+ franchise opportunities</strong> across Gujarat and India.
                            </p>
                            <p>
                                Join a dynamic network of <strong>investors, experts, and entrepreneurs</strong> to grow your vision.
                            </p>
                            <p>
                                Get expert guidance and proven strategies to <strong>start or expand your business</strong> with FranmaxIndia.
                            </p>
                            <p>
                                Whether you're just starting out or already established, our platform helps you find the <strong>right franchise</strong> and unlock real growth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}