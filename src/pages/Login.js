import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import BASE_URL from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          email: email.trim(),
          password
        },
        {
          headers: {
            // Prevent stale global auth headers from being sent during login.
            Authorization: undefined
          }
        }
      );

      // Assuming your backend returns user data + token
      login(res.data);
      
      // Optional: redirect based on role
      // App.js index route will automatically load the correct dashboard based on role
      navigate('/'); 
      
    } catch (err) {
      console.error('Login error:', err);
      
      let backendMessage = 'Invalid email or password';

      if (err.response?.data) {
        const data = err.response.data;
        
        if (typeof data === 'string') {
          backendMessage = data;
        } else if (typeof data === 'object') {
          backendMessage = 
            data.message || 
            data.error || 
            data.detail || 
            JSON.stringify(data);
        }
      } else if (err.request) {
        backendMessage = 'Unable to connect to server. Please check your internet connection.';
      }

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'var(--background)',
    }}>
      <div 
        className="glass-card" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '40px 35px' 
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--primary)',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          }}>
            <ShieldCheck color="white" size={32} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', marginBottom: '8px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Sign in to manage complaints
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--danger)',
            padding: '14px 16px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <AlertCircle size={20} style={{ marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
                size={19}
              />
              <input
                type="email"
                className="input-field"
                style={{ paddingLeft: '46px' }}
                placeholder="yourname@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
                size={19}
              />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '46px' }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              height: '52px',
              fontSize: '1.02rem',
              fontWeight: '600'
            }}
            disabled={loading}
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <LogIn size={20} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p style={{
          marginTop: '28px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              color: 'var(--primary)', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
