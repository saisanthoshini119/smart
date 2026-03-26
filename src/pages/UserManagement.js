import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  Plus
} from 'lucide-react';
import BASE_URL from '../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const res = await axios.get(`${BASE_URL}/api/users/staff`, {
          headers: {
            'Authorization': `Bearer ${storedUser?.token}`
          }
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage student, staff, and admin accounts.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New User
        </button>
      </div>

      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        {loading ? (
          <>
            <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '20px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading staff list...</p>
          </>
        ) : users.length === 0 ? (
          <>
            <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '20px', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '10px' }}>No staff members found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Staff will appear here once registered.</p>
          </>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Name</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Branch</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 8px' }}>{u.name}</td>
                    <td style={{ padding: '10px 8px' }}>{u.email}</td>
                    <td style={{ padding: '10px 8px' }}>{u.branch || '-'}</td>
                    <td style={{ padding: '10px 8px' }}>{u.department || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

