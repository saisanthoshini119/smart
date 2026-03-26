import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ExternalLink,
  Calendar
} from 'lucide-react';
import BASE_URL from '../api';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      try {
        const res = await axios.get(`${BASE_URL}/api/complaints`, {
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
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'var(--warning)';
      case 'ASSIGNED': return 'var(--primary)';
      case 'IN_PROGRESS': return 'var(--accent)';
      case 'RESOLVED': return 'var(--success)';
      case 'REJECTED': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case 'PENDING': return 'rgba(245, 158, 11, 0.12)';
      case 'ASSIGNED': return 'rgba(79, 70, 229, 0.12)';
      case 'IN_PROGRESS': return 'rgba(14, 165, 233, 0.12)';
      case 'RESOLVED': return 'rgba(16, 185, 129, 0.12)';
      case 'REJECTED': return 'rgba(239, 68, 68, 0.12)';
      default: return 'rgba(148, 163, 184, 0.12)';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Complaint History</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track and view all your submitted complaints.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
            <input type="text" className="input-field" style={{ paddingLeft: '36px', height: '40px', width: '240px' }} placeholder="Search complaints..." />
          </div>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Complaint ID</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Title</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : complaints.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 24px', fontWeight: '600', fontSize: '0.875rem' }}>#{c.complaintId}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: '500' }}>{c.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.priority} Priority</div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem' }}>{c.category}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '4px 10px', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    background: getStatusBackground(c.status),
                    color: getStatusColor(c.status) 
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(c.status) }}></span>
                    {c.status}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && complaints.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintHistory;
