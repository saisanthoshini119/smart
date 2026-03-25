import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Clock, 
  Save,
  User
} from 'lucide-react';
import BASE_URL from '../api';

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await axios.get(`${BASE_URL}/complaints`, {
        headers: {
          'Authorization': `Bearer ${storedUser?.token}`
        }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('status', status);
      formData.append('remarks', remarks);
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await axios.put(`${BASE_URL}/complaints/${selectedComplaint.id}/status`, formData, {
        headers: {
          'Authorization': `Bearer ${storedUser?.token}`
        }
      });
      setSelectedComplaint(null);
      fetchAssigned();
      alert('Status updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedComplaint ? '1fr 1fr' : '1fr', gap: '30px' }}>
      <div>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Department Complaints</h1>
          <p style={{ color: 'var(--text-muted)' }}>Showing complaints matching your department category.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loading ? <p>Loading...</p> : complaints.map(c => (
            <div 
              key={c.id} 
              className="glass-card" 
              style={{ 
                padding: '20px', 
                cursor: 'pointer',
                border: selectedComplaint?.id === c.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                background: selectedComplaint?.id === c.id ? 'rgba(79, 70, 229, 0.05)' : 'rgba(30, 41, 59, 0.4)'
              }}
              onClick={() => {
                setSelectedComplaint(c);
                setStatus(c.status);
                setRemarks('');
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>#{c.complaintId}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{c.priority}</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>{c.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} /> {c.student.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} /> {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {!loading && complaints.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: '15px', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)' }}>All caught up! No assigned complaints.</p>
            </div>
          )}
        </div>
      </div>

      {selectedComplaint && (
        <div className="glass-card" style={{ padding: '30px', position: 'sticky', top: '30px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Update Status</h2>
          
          <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Description</p>
            <p style={{ fontSize: '1rem' }}>{selectedComplaint.description}</p>
          </div>

          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Update Status</label>
              <select 
                className="input-field" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="VERIFIED">Verified</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Resolution Remarks</label>
              <textarea 
                className="input-field" 
                style={{ minHeight: '120px' }} 
                placeholder="Explain the updates or resolution..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Save size={18} /> Save Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;

