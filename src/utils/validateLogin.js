// validateLogin.js
export default function validateLogin({ username, password }) {
    const errors = {};

    // User Name validation
    if (!username || username.trim() === '') {
        errors.username = 'User Name is required and cannot be just spaces.';
    }

    // Password validation
    if (!password) {
        errors.password = 'Password is required.';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
    }

    return errors;
}