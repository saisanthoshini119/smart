import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Icons import removed because none are used in this component.

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setLoading(true);
    try {
      const [complaintsRes, staffRes] = await Promise.all([
        axios.get('http://localhost:8080/api/complaints', {
          headers: { 'Authorization': `Bearer ${storedUser?.token}` }
        }),
        axios.get('http://localhost:8080/api/users/staff', {
          headers: { 'Authorization': `Bearer ${storedUser?.token}` }
        })
      ]);
      setComplaints(complaintsRes.data);
      setStaff(staffRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAssign = async (complaintId, staffId) => {
    if (!staffId) return;
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      // Need to stringify params or pass as URL query parameters
      await axios.put(`http://localhost:8080/api/complaints/${complaintId}/assign?staffId=${staffId}`, {}, {
        headers: {
          'Authorization': `Bearer ${storedUser?.token}`
        }
      });
      alert('Staff assigned successfully!');
      fetchData(); // Refresh the data
    } catch (err) {
      console.error(err);
      alert('Failed to assign staff.');
    }
  };

  const sortedComplaints = React.useMemo(() => {
    let sortableComplaints = [...complaints];
    if (sortConfig.key !== null) {
      sortableComplaints.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableComplaints;
  }, [complaints, sortConfig]);

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Manage Complaints</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of all system complaints and assignments.</p>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student</th>
              <th 
                style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                onClick={() => {
                  if (sortConfig.key === 'title') {
                    setSortConfig({ key: 'title', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
                  } else {
                    setSortConfig({ key: 'title', direction: 'asc' });
                  }
                }}
              >
                Problem Statement {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned To</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : sortedComplaints.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>#{c.complaintId}</td>
                <td style={{ padding: '16px 24px' }}>{c.student.name}</td>
                <td style={{ padding: '16px 24px' }}>{c.title}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    background: 'rgba(255,255,255,0.05)',
                    color: c.status === 'RESOLVED' ? 'var(--success)' : 'var(--warning)'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {c.assignedStaff ? c.assignedStaff.name : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>}
                </td>
                <td style={{ padding: '16px 24px' }}>
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                     <select 
                       className="input-field" 
                       style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                       onChange={(e) => handleAssign(c.id, e.target.value)}
                       defaultValue=""
                       >
                       <option value="" disabled>Assign staff...</option>
                       {staff
                         .filter(s => {
                           // Prefer matching staff by branch with the student's branch
                           if (!c.student?.branch || !s.branch) return true;
                           return s.branch.toLowerCase() === c.student.branch.toLowerCase();
                         })
                         .map(s => (
                           <option key={s.id} value={s.id}>
                             {s.name} ({s.branch || s.department || 'No dept/branch'})
                           </option>
                         ))}
                     </select>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaints;
