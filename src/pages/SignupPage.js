import React, { useState } from 'react';
import axios from 'axios';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, email, password } = formData;
    const errorObj = {};

    if (!username) errorObj.username = 'Username is required';
    if (!email) errorObj.email = 'Email is required';
    if (!password) errorObj.password = 'Password is required';

    setErrors(errorObj);

    if (Object.keys(errorObj).length === 0) {
      setLoading(true); // Start loading
      try {
        // POST request to sign up
        const response = await axios.post('http://localhost:5000/api/users/signup', formData);
        setSuccessMessage('Signup successful! Please log in.');
        setFormData({ username: '', email: '', password: '' });
        setErrors({});
      } catch (error) {
        if (error.response) {
          // Backend returned an error response
          const errorResponse = error.response.data;
          const apiErrors = {};
          if (errorResponse.errors) {
            // Handle validation errors
            errorResponse.errors.forEach(err => {
              apiErrors[err.param] = err.msg;
            });
          } else {
            // Handle other errors
            apiErrors.api = errorResponse.message || 'An unexpected error occurred. Please try again.';
          }
          setErrors(apiErrors);
        } else {
          // Network or other error
          setErrors({ api: 'Error during signup. Please try again.' });
        }
        console.error('Error during signup:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        {errors.api && <div className="error">{errors.api}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <p>Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
};

export default SignupPage;
