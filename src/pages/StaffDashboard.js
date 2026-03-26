import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Clock, 
  Save,
  User,
  AlertCircle 
} from 'lucide-react';
import BASE_URL from '../api';

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!storedUser?.token) {
      setError('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await axios.get(`${BASE_URL}/api/complaints`, {
        headers: {
          'Authorization': `Bearer ${storedUser.token}`
        }
      });
      
      setComplaints(res.data || []);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setError(err.response?.data?.message || 'Failed to load complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedComplaint || !status || !remarks.trim()) {
      alert('Please fill all required fields');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    try {
      setUpdating(true);
      setError('');

      const formData = new URLSearchParams();
      formData.append('status', status);
      formData.append('remarks', remarks.trim());

      await axios.put(
        `${BASE_URL}/api/complaints/${selectedComplaint.id}/status`,
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${storedUser.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      alert('Status updated successfully!');
      
      // Reset form and refresh list
      setSelectedComplaint(null);
      setRemarks('');
      setStatus('');
      
      fetchAssignedComplaints(); // Refresh the list
      
    } catch (err) {
      console.error('Update failed:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update status. Please try again.';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status || 'ASSIGNED');
    setRemarks('');
    setError('');
  };

  const getStatusColor = (status) => {
    const colors = {
      'ASSIGNED': 'text-yellow-400',
      'IN_PROGRESS': 'text-blue-400',
      'VERIFIED': 'text-purple-400',
      'RESOLVED': 'text-green-400',
      'REJECTED': 'text-red-400'
    };
    return colors[status] || 'text-gray-400';
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: selectedComplaint ? '1fr 420px' : '1fr', 
      gap: '30px',
      minHeight: 'calc(100vh - 100px)'
    }}>
      
      {/* Complaints List */}
      <div>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>
            Department Complaints
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Showing complaints assigned to your department
          </p>
        </div>

        {error && (
          <div className="error-banner" style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading complaints...</p>
            </div>
          ) : complaints.length > 0 ? (
            complaints.map((c) => (
              <div 
                key={c.id} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  cursor: 'pointer',
                  border: selectedComplaint?.id === c.id 
                    ? '1px solid var(--primary)' 
                    : '1px solid rgba(255,255,255,0.05)',
                  background: selectedComplaint?.id === c.id 
                    ? 'rgba(79, 70, 229, 0.08)' 
                    : 'rgba(30, 41, 59, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleSelectComplaint(c)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    #{c.complaintId}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    color: c.priority === 'HIGH' ? '#ef4444' : 
                           c.priority === 'MEDIUM' ? '#f59e0b' : '#22c55e'
                  }}>
                    {c.priority}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', marginBottom: '10px', lineHeight: '1.4' }}>
                  {c.title}
                </h3>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px', 
                  fontSize: '0.875rem', 
                  color: 'var(--text-muted)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={14} /> {c.student?.name || 'Unknown Student'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> 
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>

                {c.status && (
                  <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <CheckCircle2 size={64} style={{ color: 'var(--success)', marginBottom: '20px', opacity: 0.6 }} />
              <h3 style={{ marginBottom: '8px' }}>All caught up!</h3>
              <p style={{ color: 'var(--text-muted)' }}>No complaints assigned to you at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Panel */}
      {selectedComplaint && (
        <div 
          className="glass-card" 
          style={{ 
            padding: '30px', 
            position: 'sticky', 
            top: '30px', 
            height: 'fit-content',
            alignSelf: 'start'
          }}
        >
          <h2 style={{ fontSize: '1.35rem', marginBottom: '24px', fontWeight: '600' }}>
            Update Complaint Status
          </h2>

          <div style={{ 
            marginBottom: '24px', 
            paddingBottom: '20px', 
            borderBottom: '1px solid rgba(255,255,255,0.08)' 
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Complaint Description
            </p>
            <p style={{ lineHeight: '1.6' }}>{selectedComplaint.description}</p>
          </div>

          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>
                Status
              </label>
              <select 
                className="input-field" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="VERIFIED">Verified</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>
                Resolution Remarks <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea 
                className="input-field" 
                style={{ minHeight: '140px', resize: 'vertical' }} 
                placeholder="Please provide detailed remarks about the resolution or actions taken..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                opacity: updating ? 0.8 : 1
              }}
              disabled={updating}
            >
              <Save size={18} />
              {updating ? 'Updating...' : 'Save Update'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;