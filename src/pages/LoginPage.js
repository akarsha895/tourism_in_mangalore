import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errorObj = {};

    if (!username) errorObj.username = 'Please enter your username';
    if (!email) errorObj.email = 'Please enter your email';

    setErrors(errorObj);

    if (Object.keys(errorObj).length === 0) {
      setLoading(true);
      try {
        // POST request to login
        const response = await axios.post('http://localhost:5000/api/users/login', { email, username });
        localStorage.setItem('token', response.data.token);
        setSuccessMessage('Login successful!');
        setErrors({}); // Clear previous errors if any
      } catch (error) {
        console.error('Error during login:', error);
        // Handle API errors
        if (error.response && error.response.status === 400) {
          setErrors({ api: 'Invalid email or username' });
        } else {
          setErrors({ api: 'Server error. Please try again.' });
        }
        setSuccessMessage(''); // Clear success message if there was an error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Username"
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        {errors.api && <div className="error">{errors.api}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
};

export default LoginForm;
