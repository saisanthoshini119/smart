import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Building, Save, Loader2, ShieldCheck } from 'lucide-react';
import BASE_URL from '../api';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    department: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      try {
        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${storedUser?.token}`
          }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setMessage({ type: 'error', text: 'Failed to load profile details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    const storedUser = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await axios.put('http://localhost:8080/api/users/profile', profile, {
        headers: {
          'Authorization': `Bearer ${storedUser?.token}`
        }
      });
      // Update local storage and auth context if needed
      const updatedUser = { ...storedUser, name: res.data.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Note: We might need a proper refresh function in AuthContext, 
      // but for now, we'll just update the local state.
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Update failed:', err);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Your Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and account settings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)'
          }}>
            {profile.name?.charAt(0)}
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>{profile.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
            {profile.role}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.875rem', background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '8px' }}>
            <ShieldCheck size={16} /> Verified Account
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-card" style={{ padding: '30px' }}>
          {message.text && (
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}33`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <User size={16} /> Full Name
              </label>
              <input 
                type="text" 
                className="input-field" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <Mail size={16} /> Email Address
              </label>
              <input 
                type="email" 
                className="input-field" 
                value={profile.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Email cannot be changed.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <Building size={16} /> Department / Batch
              </label>
              <input 
                type="text" 
                className="input-field" 
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                placeholder="e.g. Computer Science, 2024 Batch"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              disabled={saving}
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
