import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

function EditProfile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUsername(userData.username || '');
        setEmail(userData.email || '');
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password changed successfully');
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToGame = () => {
    navigate('/game');
  };

  if (loadingProfile) {
    return (
      <div className="auth-container">
        <div className="loading-profile">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card profile-card">
        <div className="auth-header">
          <h2>👨‍🌾 Edit Your Profile</h2>
          <p>Update your farm manager info</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}
        
        <div className="profile-sections">
          <section className="profile-info-section">
            <h3>Profile Information</h3>
            <form onSubmit={handleProfileUpdate} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button update-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </section>
          
          <section className="password-section">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange} className="auth-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button password-button"
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </section>
        </div>
        
        <div className="return-game-container">
          <button 
            onClick={handleReturnToGame}
            className="return-game-button"
          >
            Return to Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
