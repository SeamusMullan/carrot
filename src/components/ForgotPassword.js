import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      setMessage('Password reset link has been sent to your email');
      setEmail(''); // Clear the form
    } catch (err) {
      setError(err.message || 'Password reset request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card forgot-password-card">
        <div className="auth-header">
          <h2>🔄 Reset Your Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="auth-footer">
          <div className="auth-links">
            <Link to="/login" className="back-to-login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
